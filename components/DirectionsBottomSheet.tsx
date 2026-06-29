"use client";

import { useEffect, useMemo } from "react";

type CoordinateValue = number | string | null | undefined;

type DirectionsBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  name?: string;
  address?: string | null;
  latitude?: CoordinateValue;
  longitude?: CoordinateValue;
};

type DirectionsTarget = Pick<
  DirectionsBottomSheetProps,
  "name" | "address" | "latitude" | "longitude"
>;

type DirectionsOption = {
  service: string;
  label: string;
  helperText: string;
  iconLabel: string;
  url: string | null;
};

function getTrimmedValue(value?: string | null) {
  const trimmedValue = value?.trim();

  return trimmedValue ? trimmedValue : null;
}

function toFiniteNumber(value: CoordinateValue) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : null;
}

function getValidCoordinates({
  latitude,
  longitude,
}: Pick<DirectionsTarget, "latitude" | "longitude">) {
  const parsedLatitude = toFiniteNumber(latitude);
  const parsedLongitude = toFiniteNumber(longitude);

  if (parsedLatitude === null || parsedLongitude === null) {
    return null;
  }

  return {
    latitude: parsedLatitude,
    longitude: parsedLongitude,
  };
}

export function hasValidCoordinates(target: DirectionsTarget) {
  return Boolean(getValidCoordinates(target));
}

export function getDirectionsQuery(target: DirectionsTarget) {
  const addressQuery = getTrimmedValue(target.address);
  const nameQuery = getTrimmedValue(target.name);
  const coordinates = getValidCoordinates(target);

  if (addressQuery) {
    return addressQuery;
  }

  if (nameQuery) {
    return nameQuery;
  }

  if (coordinates) {
    return `${coordinates.latitude},${coordinates.longitude}`;
  }

  return null;
}

export function buildNaverMapUrl(target: DirectionsTarget) {
  const query = getDirectionsQuery(target);

  if (!query) {
    return null;
  }

  return `https://map.naver.com/v5/search/${encodeURIComponent(query)}`;
}

export function buildKakaoMapUrl(target: DirectionsTarget) {
  const addressQuery = getTrimmedValue(target.address);
  const nameQuery = getTrimmedValue(target.name);
  const coordinates = getValidCoordinates(target);
  const query = getDirectionsQuery(target);

  if (addressQuery) {
    return `https://map.kakao.com/link/search/${encodeURIComponent(addressQuery)}`;
  }

  if (nameQuery && coordinates) {
    return `https://map.kakao.com/link/map/${encodeURIComponent(nameQuery)},${coordinates.latitude},${coordinates.longitude}`;
  }

  if (!query) {
    return null;
  }

  return `https://map.kakao.com/link/search/${encodeURIComponent(query)}`;
}

export function buildTmapUrl(target: DirectionsTarget) {
  const query = getDirectionsQuery(target);

  if (!query) {
    return null;
  }

  // TODO: Replace with TMAP's confirmed web/app destination deep link in a later sprint.
  return `https://www.tmap.co.kr/search/search.do?searchKeyword=${encodeURIComponent(
    query,
  )}`;
}

export function openDirectionsUrl(
  service: string,
  url: string | null,
  target: DirectionsTarget,
  onOpen?: () => void,
) {
  console.log("[Directions]", service, url, {
    name: target.name,
    address: target.address,
    latitude: target.latitude,
    longitude: target.longitude,
  });

  if (!url) {
    window.alert("장소 정보가 부족해요.");
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
  onOpen?.();
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 text-meta"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function DirectionsOptionContent({ option }: { option: DirectionsOption }) {
  return (
    <>
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-accent)] text-base font-semibold text-link">
        {option.iconLabel}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-lg font-semibold text-ink">
          {option.label}
        </span>
        <span className="block text-sm leading-5 text-stone">
          {option.helperText}
        </span>
      </span>
      <ArrowIcon />
    </>
  );
}

export default function DirectionsBottomSheet({
  isOpen,
  onClose,
  name,
  address,
  latitude = null,
  longitude = null,
}: DirectionsBottomSheetProps) {
  const directionsTarget = useMemo(
    () => ({ name, address, latitude, longitude }),
    [address, latitude, longitude, name],
  );
  const options = useMemo<DirectionsOption[]>(
    () => [
      {
        service: "tmap",
        label: "TMAP",
        helperText: "티맵 검색으로 열기",
        iconLabel: "T",
        url: buildTmapUrl(directionsTarget),
      },
      {
        service: "naver",
        label: "네이버 지도",
        helperText: "네이버 지도에서 목적지 보기",
        iconLabel: "N",
        url: buildNaverMapUrl(directionsTarget),
      },
      {
        service: "kakao",
        label: "카카오맵",
        helperText: "카카오맵에서 목적지 보기",
        iconLabel: "K",
        url: buildKakaoMapUrl(directionsTarget),
      },
    ],
    [directionsTarget],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const optionClassName =
    "flex min-h-16 w-full items-center gap-4 rounded-2xl border border-border-muted bg-subtle px-4 py-3 text-left transition hover:border-brand-muted hover:bg-tint focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-hover";

  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center px-0 sm:items-end sm:px-5 sm:py-6">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-scrim backdrop-blur-[2px]"
        onClick={onClose}
        tabIndex={-1}
        aria-label="배경 클릭으로 길찾기 닫기"
      />
      <div
        className="relative z-10 w-full max-w-md rounded-t-2xl border border-default bg-surface px-5 pb-5 pt-4 shadow-xl sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="directions-sheet-title"
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[color:var(--color-border-strong)] sm:hidden" />

        <div className="flex items-center justify-between gap-4">
          <h2
            id="directions-sheet-title"
            className="text-2xl font-semibold tracking-normal text-ink"
          >
            길찾기
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-stone transition hover:bg-[color:var(--color-accent)]/70 hover:text-ink focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-hover"
            aria-label="길찾기 닫기"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {options.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() =>
                openDirectionsUrl(
                  option.service,
                  option.url,
                  directionsTarget,
                  onClose,
                )
              }
              disabled={!option.url}
              className={`${optionClassName} disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:border-border-muted disabled:hover:bg-subtle`}
            >
              <DirectionsOptionContent option={option} />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 min-h-12 w-full rounded-full border border-default px-5 py-2.5 text-base font-semibold text-link transition hover:border-brand-muted hover:bg-subtle focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
