"use client";

import { useEffect, useState } from "react";
import EmptyState from "@/components/EmptyState";
import PlaceCard from "@/components/PlaceCard";
import StatusMessage from "@/components/StatusMessage";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { mapSupabaseError } from "@/lib/errors/userMessages";
import {
  getSavedPlaces,
  type SavedPlaceListItem,
} from "@/lib/places/getSavedPlaces";

function formatSavedDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

export default function SavedPlacesList() {
  const [savedPlaces, setSavedPlaces] = useState<SavedPlaceListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [requiresLogin, setRequiresLogin] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadSavedPlaces() {
      try {
        const user = await getCurrentUser();

        if (!user) {
          if (isMounted) {
            setRequiresLogin(true);
            setSavedPlaces([]);
            setErrorMessage("");
          }
          return;
        }

        const nextSavedPlaces = await getSavedPlaces(user.id);

        if (isMounted) {
          setSavedPlaces(nextSavedPlaces);
          setErrorMessage("");
          setRequiresLogin(false);
        }
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setErrorMessage(mapSupabaseError(error, "savedPlaces"));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSavedPlaces();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <StatusMessage>저장한 장소를 불러오는 중...</StatusMessage>;
  }

  if (errorMessage) {
    return <StatusMessage tone="error">{errorMessage}</StatusMessage>;
  }

  if (requiresLogin) {
    return (
      <EmptyState
        title="저장한 장소를 보려면 로그인이 필요해요."
        description="로그인하고 마음에 드는 장소를 차분히 모아보세요."
        actionHref="/login"
        actionLabel="로그인하기"
      />
    );
  }

  if (savedPlaces.length === 0) {
    return (
      <EmptyState
        title="아직 저장한 장소가 없어요."
        description="마음에 드는 장소를 저장해보세요."
        actionHref="/explore"
        actionLabel="둘러보기"
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {savedPlaces.map((savedPlace) => (
        <div key={savedPlace.savedPlaceId} className="relative h-full">
          <PlaceCard place={savedPlace.place} variant="grid" />
          <span className="absolute right-4 top-4 rounded-full bg-[#FCFBF8]/95 px-3 py-1 text-base font-medium text-[#4D5748] shadow-[0_8px_18px_rgba(77,87,72,0.08)]">
            저장일 {formatSavedDate(savedPlace.savedAt)}
          </span>
        </div>
      ))}
    </div>
  );
}
