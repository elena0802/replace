"use client";

import { useEffect, useRef, useState } from "react";
import type { NaverPlaceSearchResult } from "@/types/place";

const placeSearchMinLength = 2;
const placeSearchDebounceMs = 400;

type NaverPlaceSearchResponse = {
  results?: NaverPlaceSearchResult[];
  error?: string;
};

type UseNaverPlaceSearchOptions = {
  enabled: boolean;
  query: string;
  selectedPlaceName?: string;
};

export function useNaverPlaceSearch({
  enabled,
  query,
  selectedPlaceName,
}: UseNaverPlaceSearchOptions) {
  const [results, setResults] = useState<NaverPlaceSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const trimmedQuery = query.trim();
  const canSearch = enabled && trimmedQuery.length >= placeSearchMinLength;

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }

      abortControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!canSearch || selectedPlaceName === trimmedQuery) {
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timeoutId = setTimeout(async () => {
      if (controller.signal.aborted) {
        return;
      }

      try {
        setIsSearching(true);
        setIsOpen(true);

        const searchParams = new URLSearchParams({
          q: trimmedQuery,
          display: "5",
        });
        const response = await fetch(
          `/api/naver/search-place?${searchParams.toString()}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(`Place search failed with status ${response.status}`);
        }

        const data = (await response.json()) as NaverPlaceSearchResponse;
        setResults((data.results ?? []).slice(0, 5));
        setErrorMessage("");
        setIsOpen(true);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Place autocomplete failed:", error);
        setResults([]);
        setErrorMessage("검색 결과를 불러오지 못했어요");
        setIsOpen(true);
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, placeSearchDebounceMs);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);

      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    };
  }, [canSearch, selectedPlaceName, trimmedQuery]);

  function abortSearch() {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsSearching(false);
  }

  function clearResults() {
    setResults([]);
    setErrorMessage("");
  }

  function close() {
    abortSearch();
    setIsOpen(false);
  }

  function closeSoon() {
    closeTimeoutRef.current = setTimeout(close, 180);
  }

  function openIfReady() {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    if (canSearch) {
      setIsOpen(true);
    }
  }

  function handleQueryInput(nextQuery: string, shouldOpen: boolean) {
    const nextTrimmedQuery = nextQuery.trim();

    if (nextTrimmedQuery.length < placeSearchMinLength) {
      abortSearch();
      clearResults();
      setIsOpen(false);
      return;
    }

    if (shouldOpen) {
      setIsSearching(true);
      setIsOpen(true);
    }
  }

  return {
    canSearch,
    clearResults,
    close,
    closeSoon,
    errorMessage,
    handleQueryInput,
    isOpen,
    isSearching,
    openIfReady,
    results,
  };
}
