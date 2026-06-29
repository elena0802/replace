"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import EmptyState from "@/components/EmptyState";
import PlaceCard from "@/components/PlaceCard";
import StatusMessage from "@/components/StatusMessage";
import { mapSupabaseError } from "@/lib/errors/userMessages";
import { getSessionUser } from "@/lib/auth/getSessionUser";
import { getPublicPlaces } from "@/lib/places/getPublicPlaces";
import type { PlaceRow } from "@/types/database";

function getFeaturedPublicPlaces(places: PlaceRow[]) {
  return [...places]
    .sort((a, b) => {
      const imagePriority =
        Number(Boolean(b.image_url)) - Number(Boolean(a.image_url));

      if (imagePriority !== 0) {
        return imagePriority;
      }

      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    })
    .slice(0, 3);
}

export default function FeaturedPlacesList() {
  const [places, setPlaces] = useState<PlaceRow[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPlaces() {
      try {
        const user = await getSessionUser();
        const publicPlaces = await getPublicPlaces();
        const featuredPlaces = getFeaturedPublicPlaces(publicPlaces);

        if (isMounted) {
          setIsLoggedIn(Boolean(user));
          setPlaces(featuredPlaces);
          setErrorMessage("");
        }
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setErrorMessage(mapSupabaseError(error, "publicPlaces"));
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

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-base font-medium text-stone">공개 아카이브</p>
          <h2 className="mt-2 text-[2rem] font-semibold leading-tight tracking-normal text-ink">
            다른 사람들이 남긴 좋은 시간
          </h2>
        </div>
        <Link
          href="/explore"
          className="text-base font-semibold text-stone transition hover:text-link focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover"
        >
          전체 보기
        </Link>
      </div>

      {isLoading ? (
        <StatusMessage>공개된 장소를 불러오는 중...</StatusMessage>
      ) : errorMessage ? (
        <StatusMessage tone="error">{errorMessage}</StatusMessage>
      ) : places.length === 0 ? (
        <EmptyState
          title="아직 공개된 장소가 없습니다."
          description="첫 번째 장소를 기록하거나 다른 이용자의 공개 기록을 기다려보세요."
          actionHref={isLoggedIn ? "/places/new" : "/explore"}
          actionLabel={isLoggedIn ? "장소 기록하기" : "둘러보기"}
        />
      ) : (
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} variant="featured" />
          ))}
        </div>
      )}
    </section>
  );
}
