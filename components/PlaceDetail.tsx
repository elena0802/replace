"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EmptyState from "@/components/EmptyState";
import KakaoShareButton from "@/components/KakaoShareButton";
import FeaturedInSecondSeason from "@/components/place-detail/FeaturedInSecondSeason";
import PlaceLocationCard from "@/components/PlaceLocationCard";
import SavePlaceButton from "@/components/SavePlaceButton";
import SaveToCollectionButton from "@/components/SaveToCollectionButton";
import StatusMessage from "@/components/StatusMessage";
import { placeEssayRelations } from "@/data/placeEssayRelations";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import {
  mapGenericError,
  mapSupabaseError,
  userMessages,
} from "@/lib/errors/userMessages";
import { formatRegionLabel } from "@/lib/format/location";
import { deletePlace } from "@/lib/places/deletePlace";
import { getPlaceById } from "@/lib/places/getPlaceById";
import type { PlaceRow } from "@/types/database";

type PlaceDetailProps = {
  id: string;
};

type PlaceLocationFields = PlaceRow & {
  address?: string | null;
  jibun_address?: string | null;
  lat?: number | null;
  lng?: number | null;
  location?: string | null;
  place_address?: string | null;
};

const detailStyles = {
  page: "mx-auto w-full max-w-6xl px-5 py-8 pb-10 sm:pb-12 lg:px-8 lg:py-12",
  nav: "mb-8 flex flex-wrap gap-x-4 gap-y-1.5 text-sm",
  navLink:
    "font-medium text-link transition-colors duration-200 hover:text-ink",
  navLinkMuted:
    "font-medium text-stone transition-colors duration-200 hover:text-ink",
  contentGrid:
    "grid gap-8 p-5 sm:p-8 sm:pb-10 lg:grid-cols-[minmax(0,1fr)_272px] lg:gap-10 lg:p-10 lg:pb-12",
  mainColumn: "flex flex-col gap-8",
  sectionLabel: "text-sm font-normal text-meta",
  sectionHeading: "text-base font-semibold text-ink",
  memoryBody:
    "max-w-prose text-lg leading-[1.8] text-ink sm:text-[1.2rem] sm:leading-[1.85]",
  revisitPanel:
    "max-w-prose rounded-lg border border-border-muted/80 bg-subtle/50 px-4 py-3.5",
  metaRow: "flex min-h-7 flex-wrap items-center gap-1.5",
  categoryChip:
    "inline-flex min-h-7 items-center rounded-full bg-[color:var(--color-accent)] px-3 py-1 text-sm font-medium text-link",
  regionText: "min-w-0 truncate text-sm font-normal text-stone",
  visibilityChip:
    "inline-flex min-h-7 items-center rounded-full border border-default px-3 py-1 text-sm font-medium text-meta",
  tagChip:
    "inline-flex min-h-7 items-center rounded-full bg-subtle px-3 py-1 text-sm font-medium text-stone",
  sidebarPanel: "overflow-hidden rounded-xl border border-default bg-subtle",
  sidebarSection: "p-5",
  sidebarDivider: "border-t border-border-muted",
  actionGroupLabel: "text-sm font-normal text-meta",
  actionButtons: "flex flex-wrap gap-2",
  ownerEditLink:
    "inline-flex min-h-11 items-center justify-center rounded-full border border-default bg-surface/70 px-3.5 py-2 text-sm font-medium text-link transition-colors duration-200 hover:border-brand-muted hover:bg-surface focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover",
  ownerDeleteButton:
    "inline-flex min-h-11 items-center justify-center rounded-full px-3.5 py-2 text-sm font-medium text-danger transition-colors duration-200 hover:bg-danger-surface/60 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-danger disabled:cursor-not-allowed disabled:opacity-70",
  mobileActionPanel:
    "overflow-hidden rounded-xl border border-default bg-subtle/50 lg:hidden",
  mobileActionSection: "p-4",
} as const;

function firstNonEmptyString(values: Array<string | null | undefined>) {
  return values.find((value) => value?.trim())?.trim() ?? null;
}

function getPlaceLocationData(place: PlaceRow) {
  const locationFields = place as PlaceLocationFields;

  return {
    address: firstNonEmptyString([
      locationFields.road_address,
      locationFields.address,
      locationFields.jibun_address,
      locationFields.location,
      locationFields.place_address,
      place.region,
    ]),
    latitude: locationFields.latitude ?? locationFields.lat ?? null,
    longitude: locationFields.longitude ?? locationFields.lng ?? null,
  };
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "기록 없음";
  }

  const date = new Date(value.includes("T") ? value : `${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

function MetadataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs font-normal text-meta">{label}</dt>
      <dd className="text-sm leading-6 text-stone">{value || "기록 없음"}</dd>
    </div>
  );
}

function PlaceDetailHero({ place }: { place: PlaceRow }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[color:var(--color-accent)] sm:aspect-[16/10] lg:aspect-[2/1]">
      {place.image_url ? (
        <Image
          src={place.image_url}
          alt={`${place.name} 사진`}
          fill
          priority
          sizes="(min-width: 1024px) 1152px, 100vw"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center">
          <span className="text-lg font-semibold text-link sm:text-xl">
            사진이 아직 없어요
          </span>
          <span className="text-sm font-medium text-stone sm:text-base">
            좋은 순간을 사진으로 남겨보세요
          </span>
        </div>
      )}
    </div>
  );
}

function VisitorActions({
  place,
  onError,
}: {
  place: PlaceRow;
  onError: (message: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className={detailStyles.actionGroupLabel}>이 장소 기록</p>
      <div className={detailStyles.actionButtons}>
        {place.is_public ? (
          <SavePlaceButton placeId={place.id} size="compact" />
        ) : null}
        <SaveToCollectionButton placeId={place.id} size="compact" />
        <KakaoShareButton place={place} onError={onError} size="compact" />
      </div>
    </div>
  );
}

function OwnerActions({
  placeId,
  isDeleting,
  onDelete,
}: {
  placeId: string;
  isDeleting: boolean;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className={detailStyles.actionGroupLabel}>내 기록 관리</p>
      <div className={detailStyles.actionButtons}>
        <Link href={`/places/${placeId}/edit`} className={detailStyles.ownerEditLink}>
          수정하기
        </Link>
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className={detailStyles.ownerDeleteButton}
        >
          {isDeleting ? "삭제하는 중..." : "삭제하기"}
        </button>
      </div>
    </div>
  );
}

function MobileActionPanel({
  place,
  canManagePlace,
  isDeleting,
  onError,
  onDelete,
}: {
  place: PlaceRow;
  canManagePlace: boolean;
  isDeleting: boolean;
  onError: (message: string) => void;
  onDelete: () => void;
}) {
  return (
    <div className={detailStyles.mobileActionPanel}>
      <div className={detailStyles.mobileActionSection}>
        <VisitorActions place={place} onError={onError} />
      </div>
      {canManagePlace ? (
        <div
          className={`${detailStyles.mobileActionSection} ${detailStyles.sidebarDivider}`}
        >
          <OwnerActions
            placeId={place.id}
            isDeleting={isDeleting}
            onDelete={onDelete}
          />
        </div>
      ) : null}
    </div>
  );
}

function SidebarPanel({
  place,
  canManagePlace,
  isDeleting,
  onError,
  onDelete,
}: {
  place: PlaceRow;
  canManagePlace: boolean;
  isDeleting: boolean;
  onError: (message: string) => void;
  onDelete: () => void;
}) {
  return (
    <aside className="hidden lg:sticky lg:top-8 lg:block lg:self-start">
      <div className={detailStyles.sidebarPanel}>
        <div className={detailStyles.sidebarSection}>
          <VisitorActions place={place} onError={onError} />
        </div>

        <section
          aria-labelledby="place-moment-heading"
          className={`${detailStyles.sidebarSection} ${detailStyles.sidebarDivider}`}
        >
          <h2 id="place-moment-heading" className={detailStyles.sectionHeading}>
            머물렀던 순간
          </h2>
          <dl className="mt-4 space-y-3.5">
            <MetadataItem
              label="다녀온 날짜"
              value={formatDate(place.visited_date)}
            />
            <MetadataItem
              label="함께한 사람"
              value={place.companion ?? "기록 없음"}
            />
            <MetadataItem
              label="기록한 날"
              value={formatDate(place.created_at)}
            />
          </dl>
        </section>

        {canManagePlace ? (
          <div
            className={`${detailStyles.sidebarSection} ${detailStyles.sidebarDivider}`}
          >
            <OwnerActions
              placeId={place.id}
              isDeleting={isDeleting}
              onDelete={onDelete}
            />
          </div>
        ) : null}
      </div>
    </aside>
  );
}

export default function PlaceDetail({ id }: PlaceDetailProps) {
  const router = useRouter();
  const [place, setPlace] = useState<PlaceRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [isNotFound, setIsNotFound] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [canManagePlace, setCanManagePlace] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPlace() {
      try {
        const [nextPlace, currentUser] = await Promise.all([
          getPlaceById(id),
          getCurrentUser(),
        ]);

        if (!isMounted) {
          return;
        }

        if (!nextPlace) {
          setIsNotFound(true);
          setPlace(null);
          return;
        }

        setPlace(nextPlace);
        setCanManagePlace(
          Boolean(currentUser && nextPlace.user_id === currentUser.id),
        );
        setErrorMessage("");
        setIsNotFound(false);
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setErrorMessage(mapSupabaseError(error, "placeDetail"));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPlace();

    return () => {
      isMounted = false;
    };
  }, [id]);

  async function handleDelete() {
    if (!place || isDeleting) {
      return;
    }

    const shouldDelete = window.confirm("이 장소 기록을 삭제할까요?");

    if (!shouldDelete) {
      return;
    }

    setIsDeleting(true);
    setActionError("");

    try {
      await deletePlace(place.id);
      router.push("/my-places");
    } catch (error) {
      console.error(error);
      setActionError(mapGenericError(error, userMessages.deletePlaceFailed));
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
        <StatusMessage>장소를 불러오는 중...</StatusMessage>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mx-auto w-full max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
        <StatusMessage tone="error">{errorMessage}</StatusMessage>
      </div>
    );
  }

  if (isNotFound || !place) {
    return (
      <div className="mx-auto w-full max-w-3xl px-5 py-12 lg:px-8 lg:py-16">
        <EmptyState
          title="이 장소를 찾을 수 없어요."
          description="삭제되었거나 존재하지 않는 기록입니다."
          actionHref="/explore"
          actionLabel="둘러보기로 이동"
        />
      </div>
    );
  }

  const placeLocation = getPlaceLocationData(place);
  const relatedEssay = placeEssayRelations[place.id];
  const regionLabel = formatRegionLabel(place.road_address ?? place.region);

  return (
    <div className={detailStyles.page}>
      <nav aria-label="장소 상세 내비게이션" className={detailStyles.nav}>
        <Link href="/explore" className={detailStyles.navLink}>
          둘러보기로 돌아가기
        </Link>
        <Link href="/my-places" className={detailStyles.navLinkMuted}>
          내 장소로 돌아가기
        </Link>
      </nav>

      {actionError ? (
        <StatusMessage tone="error" className="mb-6 text-left">
          {actionError}
        </StatusMessage>
      ) : null}

      <article className="overflow-hidden rounded-xl border border-default bg-surface shadow-card">
        <PlaceDetailHero place={place} />

        <div className={detailStyles.contentGrid}>
          <div className={detailStyles.mainColumn}>
            <header className="space-y-3">
              <h1 className="text-3xl font-semibold leading-tight tracking-normal text-ink sm:text-4xl lg:text-[2.35rem] lg:leading-tight">
                {place.name}
              </h1>
              <div className={detailStyles.metaRow}>
                <span className={detailStyles.categoryChip}>
                  {place.category}
                </span>
                {regionLabel ? (
                  <span className={detailStyles.regionText}>{regionLabel}</span>
                ) : null}
                <span className={detailStyles.visibilityChip}>
                  {place.is_public ? "공개" : "비공개"}
                </span>
              </div>
            </header>

            <section
              aria-labelledby="place-memory-heading"
              className="space-y-3"
            >
              <h2 id="place-memory-heading" className={detailStyles.sectionLabel}>
                한 줄 기록
              </h2>
              <p className={detailStyles.memoryBody}>{place.memory}</p>
            </section>

            <div className={detailStyles.revisitPanel}>
              <p className={detailStyles.sectionLabel}>다시 가고 싶은 마음</p>
              <p className="mt-1.5 text-base leading-7 text-stone">
                {place.revisit_level}
              </p>
            </div>

            {place.space_tags.length > 0 ? (
              <section
                aria-labelledby="place-space-heading"
                className="space-y-2.5"
              >
                <h2 id="place-space-heading" className={detailStyles.sectionLabel}>
                  공간 정보
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {place.space_tags.map((tag) => (
                    <span key={tag} className={detailStyles.tagChip}>
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            <MobileActionPanel
              place={place}
              canManagePlace={canManagePlace}
              isDeleting={isDeleting}
              onError={setActionError}
              onDelete={handleDelete}
            />

            <PlaceLocationCard
              name={place.name}
              address={placeLocation.address}
              latitude={placeLocation.latitude}
              longitude={placeLocation.longitude}
            />
          </div>

          <SidebarPanel
            place={place}
            canManagePlace={canManagePlace}
            isDeleting={isDeleting}
            onError={setActionError}
            onDelete={handleDelete}
          />
        </div>

        {relatedEssay ? <FeaturedInSecondSeason essay={relatedEssay} /> : null}
      </article>
    </div>
  );
}
