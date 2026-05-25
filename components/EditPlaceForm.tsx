"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PlaceForm from "@/components/PlaceForm";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
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
          setErrorMessage("장소 기록을 불러오지 못했습니다.");
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
        <div className="rounded-3xl border border-[#E5E0D8] bg-[#FCFBF8] px-5 py-12 text-center shadow-[0_14px_34px_rgba(77,87,72,0.06)]">
          <p className="text-xl font-semibold text-[#4D5748]">
            기록을 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mx-auto w-full max-w-4xl px-5 py-12 lg:px-8 lg:py-16">
        <div
          className="rounded-3xl border border-[#E5C8BA] bg-[#FFF8F4] px-5 py-8 text-lg font-semibold leading-8 text-[#7A4B3A]"
          role="alert"
        >
          {errorMessage}
        </div>
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
        <div className="rounded-3xl border border-[#E5E0D8] bg-[#FCFBF8] px-5 py-12 text-center shadow-[0_14px_34px_rgba(77,87,72,0.06)] sm:px-8">
          <h1 className="text-4xl font-semibold leading-tight tracking-normal text-[#3F3F3B]">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-xl leading-9 text-[#6B6B68]">
            {description}
          </p>
          <Link
            href={href}
            className="mt-8 inline-flex min-h-14 items-center justify-center rounded-full bg-[#A8B2A1] px-7 py-4 text-xl font-semibold text-[#2F362D] shadow-[0_10px_24px_rgba(77,87,72,0.14)] transition hover:bg-[#4D5748] hover:text-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
          >
            {buttonLabel}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="mb-8 space-y-3">
        <p className="text-lg font-medium text-[#4D5748]">기록 수정</p>
        <h1 className="text-4xl font-semibold leading-tight tracking-normal text-[#3F3F3B]">
          {placeName || "장소 기록"}을 다시 정리하세요
        </h1>
        <p className="text-xl leading-9 text-[#6B6B68]">
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
