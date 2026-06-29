"use client";

import { useEffect, useState } from "react";
import EmptyState from "@/components/EmptyState";
import PlaceForm from "@/components/PlaceForm";
import StatusMessage from "@/components/StatusMessage";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { mapSupabaseError } from "@/lib/errors/userMessages";
import { getPlaceById } from "@/lib/places/getPlaceById";
import { mapPlaceFormToUpdate } from "@/lib/places/mapPlaceFormToUpdate";
import { mapPlaceRowToForm } from "@/lib/places/mapPlaceRowToForm";
import { updatePlace } from "@/lib/places/updatePlace";
import type { PlaceFormValues } from "@/types/place";

type EditPlaceFormProps = {
  id: string;
};

export default function EditPlaceForm({ id }: EditPlaceFormProps) {
  const [initialValues, setInitialValues] = useState<PlaceFormValues | null>(
    null,
  );
  const [initialImageUrl, setInitialImageUrl] = useState<string | null>(null);
  const [placeName, setPlaceName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isNotFound, setIsNotFound] = useState(false);
  const [accessMessage, setAccessMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPlace() {
      try {
        const [place, currentUser] = await Promise.all([
          getPlaceById(id),
          getCurrentUser(),
        ]);

        if (!isMounted) {
          return;
        }

        if (!place) {
          setIsNotFound(true);
          setInitialValues(null);
          return;
        }

        if (!currentUser) {
          setAccessMessage("장소 기록을 수정하려면 로그인이 필요해요.");
          setInitialValues(null);
          return;
        }

        if (place.user_id !== currentUser.id) {
          setAccessMessage("이 장소 기록을 수정할 권한이 없어요.");
          setInitialValues(null);
          return;
        }

        setInitialValues(mapPlaceRowToForm(place));
        setInitialImageUrl(place.image_url);
        setPlaceName(place.name);
        setErrorMessage("");
        setIsNotFound(false);
        setAccessMessage("");
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

  async function handleSubmit(values: PlaceFormValues, imageUrl: string | null) {
    const updatedPlace = await updatePlace(
      id,
      mapPlaceFormToUpdate(values, imageUrl),
    );
    console.log("Updated place:", JSON.stringify(updatedPlace));
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-5 py-12 lg:px-8 lg:py-16">
        <StatusMessage>기록을 불러오는 중...</StatusMessage>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mx-auto w-full max-w-4xl px-5 py-12 lg:px-8 lg:py-16">
        <StatusMessage tone="error">{errorMessage}</StatusMessage>
      </div>
    );
  }

  if (isNotFound || !initialValues) {
    const title = accessMessage || "수정할 장소를 찾을 수 없어요.";
    const description = accessMessage
      ? "내가 남긴 장소 기록만 수정할 수 있습니다."
      : "삭제되었거나 존재하지 않는 기록입니다.";
    const href = accessMessage.includes("로그인") ? "/login" : "/explore";
    const buttonLabel = accessMessage.includes("로그인")
      ? "로그인하기"
      : "둘러보기로 이동";

    return (
      <div className="mx-auto w-full max-w-3xl px-5 py-12 lg:px-8 lg:py-16">
        <EmptyState
          title={title}
          description={description}
          actionHref={href}
          actionLabel={buttonLabel}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="mb-8 space-y-3">
        <p className="text-lg font-medium text-link">기록 수정</p>
        <h1 className="text-4xl font-semibold leading-tight tracking-normal text-ink">
          {placeName || "장소 기록"}을 다시 정리하세요
        </h1>
        <p className="text-xl leading-9 text-stone">
          남겨둔 좋은 시간의 세부 내용을 차분히 다듬어보세요.
        </p>
      </div>

      <PlaceForm
        initialValues={initialValues}
        initialImageUrl={initialImageUrl}
        mode="edit"
        onSubmit={handleSubmit}
        successRedirectPath={`/places/${id}`}
      />
    </div>
  );
}
