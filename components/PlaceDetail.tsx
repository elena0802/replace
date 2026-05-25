"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
  const [place, setPlace] = useState<PlaceRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPlace() {
      try {
        const nextPlace = await getPlaceById(id);

        if (!isMounted) {
          return;
        }

        if (!nextPlace) {
          setIsNotFound(true);
          setPlace(null);
          return;
        }

        setPlace(nextPlace);
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

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="rounded-3xl border border-[#E5E0D8] bg-[#FCFBF8] px-5 py-12 text-center shadow-[0_14px_34px_rgba(77,87,72,0.06)]">
          <p className="text-xl font-semibold text-[#4D5748]">
            장소를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mx-auto w-full max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
        <div
          className="rounded-3xl border border-[#E5C8BA] bg-[#FFF8F4] px-5 py-8 text-lg font-semibold leading-8 text-[#7A4B3A]"
          role="alert"
        >
          {errorMessage}
        </div>
      </div>
    );
  }

  if (isNotFound || !place) {
    return (
      <div className="mx-auto w-full max-w-3xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="rounded-3xl border border-[#E5E0D8] bg-[#FCFBF8] px-5 py-12 text-center shadow-[0_14px_34px_rgba(77,87,72,0.06)] sm:px-8">
          <h1 className="text-4xl font-semibold leading-tight tracking-normal text-[#3F3F3B]">
            이 장소를 찾을 수 없어요.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-xl leading-9 text-[#6B6B68]">
            삭제되었거나 존재하지 않는 기록입니다.
          </p>
          <Link
            href="/explore"
            className="mt-8 inline-flex min-h-14 items-center justify-center rounded-full bg-[#A8B2A1] px-7 py-4 text-xl font-semibold text-[#2F362D] shadow-[0_10px_24px_rgba(77,87,72,0.14)] transition hover:bg-[#4D5748] hover:text-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
          >
            둘러보기로 이동
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="mb-6 flex flex-wrap gap-4">
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
                Re:Place
              </span>
              <span className="text-lg font-medium text-[#6B6B68]">
                사진이 없는 장소 기록
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
