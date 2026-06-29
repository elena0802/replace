"use client";

import { useEffect, useState } from "react";
import EmptyState from "@/components/EmptyState";
import PlaceCard from "@/components/PlaceCard";
import StatusMessage from "@/components/StatusMessage";
import { mapSupabaseError } from "@/lib/errors/userMessages";
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

  if (isLoading) {
    return <StatusMessage>공개된 장소를 불러오는 중...</StatusMessage>;
  }

  if (errorMessage) {
    return <StatusMessage tone="error">{errorMessage}</StatusMessage>;
  }

  if (places.length === 0) {
    return (
      <EmptyState
        title="아직 공개된 장소가 없어요."
        description="누군가의 좋은 장소와 시간이 이곳에 쌓일 예정이에요."
        actionHref="/places/new"
        actionLabel="내 장소 기록하기"
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
}
