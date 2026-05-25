"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PlaceCard from "@/components/PlaceCard";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getPlaces } from "@/lib/places/getPlaces";
import type { PlaceRow } from "@/types/database";

export default function MyPlacesList() {
  const [places, setPlaces] = useState<PlaceRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [requiresLogin, setRequiresLogin] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPlaces() {
      try {
        const user = await getCurrentUser();

        if (!user) {
          if (isMounted) {
            setRequiresLogin(true);
            setPlaces([]);
            setErrorMessage("");
          }
          return;
        }

        const nextPlaces = await getPlaces();

        if (isMounted) {
          setPlaces(nextPlaces);
          setErrorMessage("");
          setRequiresLogin(false);
        }
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setErrorMessage(
            "장소 기록을 불러오지 못했습니다. Supabase 설정을 확인해주세요.",
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
          기록을 불러오는 중...
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

  if (requiresLogin) {
    return (
      <div className="rounded-3xl border border-[#E5E0D8] bg-[#FCFBF8] px-5 py-12 text-center shadow-[0_14px_34px_rgba(77,87,72,0.06)] sm:px-8">
        <h2 className="text-3xl font-semibold tracking-normal text-[#3F3F3B]">
          내 장소 기록을 보려면 로그인이 필요해요.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-xl leading-9 text-[#6B6B68]">
          로그인 후 내가 남긴 좋은 장소와 시간을 모아볼 수 있어요.
        </p>
        <Link
          href="/login"
          className="mt-7 inline-flex min-h-14 items-center justify-center rounded-full bg-[#A8B2A1] px-7 py-4 text-xl font-semibold text-[#2F362D] shadow-[0_10px_24px_rgba(77,87,72,0.14)] transition hover:bg-[#4D5748] hover:text-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
        >
          로그인하기
        </Link>
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="rounded-3xl border border-[#E5E0D8] bg-[#FCFBF8] px-5 py-12 text-center shadow-[0_14px_34px_rgba(77,87,72,0.06)] sm:px-8">
        <h2 className="text-3xl font-semibold tracking-normal text-[#3F3F3B]">
          아직 기록한 장소가 없어요.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-xl leading-9 text-[#6B6B68]">
          좋은 장소와 시간을 첫 번째 기록으로 남겨보세요.
        </p>
        <Link
          href="/places/new"
          className="mt-7 inline-flex min-h-14 items-center justify-center rounded-full bg-[#A8B2A1] px-7 py-4 text-xl font-semibold text-[#2F362D] shadow-[0_10px_24px_rgba(77,87,72,0.14)] transition hover:bg-[#4D5748] hover:text-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
        >
          장소 기록하기
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {places.map((place) => (
        <div key={place.id} className="relative">
          <PlaceCard place={place} />
          <span className="absolute right-4 top-4 rounded-full bg-[#FCFBF8]/95 px-3 py-1 text-base font-medium text-[#4D5748] shadow-[0_8px_18px_rgba(77,87,72,0.08)]">
            {place.is_public ? "공개" : "비공개"}
          </span>
        </div>
      ))}
    </div>
  );
}
