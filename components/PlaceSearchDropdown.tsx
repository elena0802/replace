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
      className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-default bg-surface shadow-lg"
    >
      {isSearching ? (
        <p className="px-4 py-4 text-base font-medium text-stone">
          장소를 찾는 중...
        </p>
      ) : errorMessage ? (
        <p className="px-4 py-4 text-base font-medium text-danger">
          {errorMessage}
        </p>
      ) : results.length === 0 ? (
        <p className="px-4 py-4 text-base font-medium text-stone">
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
                  className="block w-full px-4 py-3 text-left transition hover:bg-subtle focus:bg-subtle focus:outline-none"
                  role="option"
                  aria-selected="false"
                >
                  <span className="block text-lg font-semibold text-ink">
                    {place.name}
                  </span>
                  {place.category && (
                    <span className="mt-1 block text-sm font-medium text-link">
                      {place.category}
                    </span>
                  )}
                  {address && (
                    <span className="mt-1 block text-sm font-medium leading-6 text-stone">
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
