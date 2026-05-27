"use client";

import { getPlaceAddress } from "@/lib/places/naverPlace";
import type { NaverPlaceSearchResult } from "@/types/place";

type PlaceSearchDropdownProps = {
  errorMessage: string;
  isSearching: boolean;
  onSelectPlace: (place: NaverPlaceSearchResult) => void;
  results: NaverPlaceSearchResult[];
};

export default function PlaceSearchDropdown({
  errorMessage,
  isSearching,
  onSelectPlace,
  results,
}: PlaceSearchDropdownProps) {
  return (
    <div
      id="place-search-results"
      role="listbox"
      className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-[#E5E0D8] bg-[#FFFDF8] shadow-[0_16px_36px_rgba(77,87,72,0.13)]"
    >
      {isSearching ? (
        <p className="px-4 py-4 text-base font-medium text-[#6B6B68]">
          장소를 찾는 중...
        </p>
      ) : errorMessage ? (
        <p className="px-4 py-4 text-base font-medium text-[#7A4B3A]">
          {errorMessage}
        </p>
      ) : results.length === 0 ? (
        <p className="px-4 py-4 text-base font-medium text-[#6B6B68]">
          검색 결과가 없어요
        </p>
      ) : (
        <ul className="divide-y divide-[#EFEAE2]">
          {results.map((place, index) => {
            const address = getPlaceAddress(place);

            return (
              <li key={`${place.id}-${index}`}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => onSelectPlace(place)}
                  className="block w-full px-4 py-3 text-left transition hover:bg-[#F8F6F2] focus:bg-[#F8F6F2] focus:outline-none"
                  role="option"
                  aria-selected="false"
                >
                  <span className="block text-lg font-semibold text-[#3F3F3B]">
                    {place.name}
                  </span>
                  {place.category && (
                    <span className="mt-1 block text-sm font-medium text-[#4D5748]">
                      {place.category}
                    </span>
                  )}
                  {address && (
                    <span className="mt-1 block text-sm font-medium leading-6 text-[#6B6B68]">
                      {address}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
