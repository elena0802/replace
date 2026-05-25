"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EmptyState from "@/components/EmptyState";
import StatusMessage from "@/components/StatusMessage";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { deletePlace } from "@/lib/places/deletePlace";
import { getPlaceById } from "@/lib/places/getPlaceById";
import type { PlaceRow } from "@/types/database";

type PlaceDetailProps = {
  id: string;
};

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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-[#EFEAE2] pb-4 last:border-b-0 last:pb-0">
      <p className="text-base font-medium text-[#6B6B68]">{label}</p>
      <p className="mt-1 text-xl font-semibold leading-8 text-[#3F3F3B]">
        {value || "기록 없음"}
      </p>
    </div>
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
        setCanManagePlace(Boolean(currentUser && nextPlace.user_id === currentUser.id));
        setErrorMessage("");
        setIsNotFound(false);
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setErrorMessage("장소 정보를 불러오지 못했습니다.");
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
      setActionError("장소 기록을 삭제하지 못했습니다. Supabase 설정을 확인해주세요.");
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

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-4">
          <Link
            href="/explore"
            className="inline-flex text-lg font-semibold text-[#4D5748] hover:text-[#3F3F3B]"
          >
            둘러보기로 돌아가기
          </Link>
          <Link
            href="/my-places"
            className="inline-flex text-lg font-semibold text-[#6B6B68] hover:text-[#3F3F3B]"
          >
            내 장소로 돌아가기
          </Link>
        </div>

        <div className="flex flex-wrap gap-3">
          {canManagePlace && (
            <>
              <Link
                href={`/places/${place.id}/edit`}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#A8B2A1] px-5 py-3 text-lg font-semibold text-[#2F362D] shadow-[0_8px_18px_rgba(77,87,72,0.12)] transition hover:bg-[#4D5748] hover:text-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
              >
                수정하기
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#D9C3B6] bg-[#FFF8F4] px-5 py-3 text-lg font-semibold text-[#7A4B3A] transition hover:border-[#B89282] hover:bg-[#F6EAE3] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#7A4B3A] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isDeleting ? "삭제하는 중..." : "삭제하기"}
              </button>
            </>
          )}
        </div>
      </div>

      {actionError && (
        <StatusMessage tone="error" className="mb-6 text-left">
          {actionError}
        </StatusMessage>
      )}

      <article className="overflow-hidden rounded-3xl border border-[#E5E0D8] bg-[#FCFBF8] shadow-[0_18px_44px_rgba(77,87,72,0.07)]">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EAE3D8] md:aspect-[16/7]">
          {place.image_url ? (
            <div
              className="h-full w-full bg-cover bg-center"
              role="img"
              aria-label={`${place.name} 사진`}
              style={{ backgroundImage: `url("${place.image_url}")` }}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
              <span className="text-3xl font-semibold text-[#4D5748]">
                사진이 아직 없어요
              </span>
              <span className="text-lg font-medium text-[#6B6B68]">
                좋은 순간을 사진으로 남겨보세요
              </span>
            </div>
          )}
        </div>

        <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#EAE3D8] px-4 py-2 text-lg font-medium text-[#4D5748]">
                {place.category}
              </span>
              <span className="text-xl font-medium text-[#6B6B68]">
                {place.region}
              </span>
              <span className="rounded-full border border-[#E5E0D8] px-4 py-2 text-lg font-medium text-[#6B6B68]">
                {place.is_public ? "공개" : "비공개"}
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight tracking-normal text-[#3F3F3B] sm:text-5xl">
                {place.name}
              </h1>
              <p className="text-2xl leading-10 text-[#6B6B68]">
                {place.memory}
              </p>
            </div>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-[#3F3F3B]">
                공간 정보
              </h2>
              {place.space_tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {place.space_tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#EAE3D8] px-4 py-2 text-base font-medium text-[#4D5748]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-lg leading-8 text-[#6B6B68]">
                  남겨진 공간 정보가 없어요.
                </p>
              )}
            </section>
          </div>

          <aside className="space-y-5 rounded-2xl bg-[#F8F6F2] p-5">
            <h2 className="text-2xl font-semibold text-[#3F3F3B]">
              머물렀던 순간
            </h2>
            <div className="space-y-4">
              <DetailRow label="다녀온 날짜" value={formatDate(place.visited_date)} />
              <DetailRow label="함께한 사람" value={place.companion ?? "기록 없음"} />
              <DetailRow label="다시 가고 싶은 마음" value={place.revisit_level} />
              <DetailRow
                label="공개 여부"
                value={place.is_public ? "공개" : "비공개"}
              />
              <DetailRow label="기록한 날" value={formatDate(place.created_at)} />
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
