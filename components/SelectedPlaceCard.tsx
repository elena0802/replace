"use client";

import { getPlaceAddress } from "@/lib/places/naverPlace";
import type { NaverPlaceSearchResult } from "@/types/place";

type SelectedPlaceCardProps = {
  onChangePlace: () => void;
  onClearPlace: () => void;
  place: NaverPlaceSearchResult;
};

export default function SelectedPlaceCard({
  onChangePlace,
  onClearPlace,
  place,
}: SelectedPlaceCardProps) {
  const address = getPlaceAddress(place);

  return (
    <div className="rounded-2xl border border-default bg-surface p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-link">선택한 장소</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onChangePlace}
            className="rounded-full border border-default px-3 py-1 text-sm font-semibold text-link transition hover:border-brand-hover hover:bg-subtle"
          >
            변경
          </button>
          <button
            type="button"
            onClick={onClearPlace}
            className="flex size-8 items-center justify-center rounded-full border border-default text-lg font-semibold leading-none text-stone transition hover:border-brand-hover hover:bg-subtle hover:text-ink"
            aria-label="선택한 장소 지우기"
          >
            ×
          </button>
        </div>
      </div>
      <p className="mt-2 text-lg font-semibold text-ink">{place.name}</p>
      {place.category && (
        <p className="mt-1 text-sm font-medium text-link">
          {place.category}
        </p>
      )}
      {address && (
        <p className="mt-1 text-sm font-medium leading-6 text-stone">
          {address}
        </p>
      )}
      {place.mapUrl && (
        <a
          href={place.mapUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-3 inline-flex text-sm font-semibold text-link underline decoration-[#A8B2A1] underline-offset-4"
        >
          네이버 지도에서 보기
        </a>
      )}
    </div>
  );
}
