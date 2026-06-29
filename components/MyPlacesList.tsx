"use client";

import { useEffect, useState } from "react";
import EmptyState from "@/components/EmptyState";
import PlaceCard from "@/components/PlaceCard";
import PlaceGridSkeleton from "@/components/skeleton/PlaceGridSkeleton";
import StatusMessage from "@/components/StatusMessage";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { mapSupabaseError } from "@/lib/errors/userMessages";
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
          setErrorMessage(mapSupabaseError(error, "myPlaces"));
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
    return <PlaceGridSkeleton />;
  }

  if (errorMessage) {
    return <StatusMessage tone="error">{errorMessage}</StatusMessage>;
  }

  if (requiresLogin) {
    return (
      <EmptyState
        title="내 장소 기록을 보려면 로그인이 필요해요."
        description="로그인하고 나만의 장소 아카이브를 만들어보세요."
        actionHref="/login"
        actionLabel="로그인하기"
      />
    );
  }

  if (places.length === 0) {
    return (
      <EmptyState
        title="아직 기록한 장소가 없어요."
        description="좋은 장소와 시간을 첫 번째 기록으로 남겨보세요."
        actionHref="/places/new"
        actionLabel="장소 기록하기"
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {places.map((place) => (
        <div key={place.id} className="relative">
          <PlaceCard place={place} variant="grid" />
          <span className="absolute right-4 top-4 rounded-full bg-[#FCFBF8]/95 px-3 py-1 text-base font-medium text-[#4D5748] shadow-[0_8px_18px_rgba(77,87,72,0.08)]">
            {place.is_public ? "공개" : "비공개"}
          </span>
        </div>
      ))}
    </div>
  );
}
