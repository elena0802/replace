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
    <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFDF8] p-4 shadow-[0_10px_24px_rgba(77,87,72,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-[#4D5748]">선택한 장소</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onChangePlace}
            className="rounded-full border border-[#DCD5C8] px-3 py-1 text-sm font-semibold text-[#4D5748] transition hover:border-[#4D5748] hover:bg-[#F8F6F2]"
          >
            변경
          </button>
          <button
            type="button"
            onClick={onClearPlace}
            className="flex size-8 items-center justify-center rounded-full border border-[#DCD5C8] text-lg font-semibold leading-none text-[#6B6B68] transition hover:border-[#4D5748] hover:bg-[#F8F6F2] hover:text-[#3F3F3B]"
            aria-label="선택한 장소 지우기"
          >
            ×
          </button>
        </div>
      </div>
      <p className="mt-2 text-lg font-semibold text-[#3F3F3B]">{place.name}</p>
      {place.category && (
        <p className="mt-1 text-sm font-medium text-[#4D5748]">
          {place.category}
        </p>
      )}
      {address && (
        <p className="mt-1 text-sm font-medium leading-6 text-[#6B6B68]">
          {address}
        </p>
      )}
      {place.mapUrl && (
        <a
          href={place.mapUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-3 inline-flex text-sm font-semibold text-[#4D5748] underline decoration-[#A8B2A1] underline-offset-4"
        >
          네이버 지도에서 보기
        </a>
      )}
    </div>
  );
}
