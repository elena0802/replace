"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PlaceCard from "@/components/PlaceCard";
import { getPublicPlaces } from "@/lib/places/getPublicPlaces";
import type { PlaceRow } from "@/types/database";

export default function ExplorePlacesList() {
  const [places, setPlaces] = useState<PlaceRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPlaces() {
      try {
        const nextPlaces = await getPublicPlaces();

        if (isMounted) {
          setPlaces(nextPlaces);
          setErrorMessage("");
        }
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setErrorMessage(
            "공개 장소를 불러오지 못했습니다. Supabase 설정을 확인해주세요.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPlaces();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-[#E5E0D8] bg-[#FCFBF8] px-5 py-12 text-center shadow-[0_14px_34px_rgba(77,87,72,0.06)]">
        <p className="text-xl font-semibold text-[#4D5748]">
          공개된 장소를 불러오는 중...
        </p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div
        className="rounded-3xl border border-[#E5C8BA] bg-[#FFF8F4] px-5 py-8 text-lg font-semibold leading-8 text-[#7A4B3A]"
        role="alert"
      >
        {errorMessage}
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="rounded-3xl border border-[#E5E0D8] bg-[#FCFBF8] px-5 py-12 text-center shadow-[0_14px_34px_rgba(77,87,72,0.06)] sm:px-8">
        <h2 className="text-3xl font-semibold tracking-normal text-[#3F3F3B]">
          아직 공개된 장소가 없어요.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-xl leading-9 text-[#6B6B68]">
          누군가의 좋은 장소와 시간이 이곳에 쌓일 예정이에요.
        </p>
        <Link
          href="/places/new"
          className="mt-7 inline-flex min-h-14 items-center justify-center rounded-full bg-[#A8B2A1] px-7 py-4 text-xl font-semibold text-[#2F362D] shadow-[0_10px_24px_rgba(77,87,72,0.14)] transition hover:bg-[#4D5748] hover:text-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
        >
          내 장소 기록하기
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} href={null} />
      ))}
    </div>
  );
}
