"use client";

import { useEffect, useMemo } from "react";

type DirectionsBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  name?: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

type DirectionsTarget = Pick<
  DirectionsBottomSheetProps,
  "name" | "address" | "latitude" | "longitude"
>;

type DirectionsOption = {
  label: string;
  helperText: string;
  iconLabel: string;
  url: string | null;
};

function getTrimmedValue(value?: string | null) {
  const trimmedValue = value?.trim();

  return trimmedValue ? trimmedValue : null;
}

function getDestinationQuery({ address, name }: DirectionsTarget) {
  return getTrimmedValue(address) ?? getTrimmedValue(name);
}

function hasCoordinates({
  latitude,
  longitude,
}: Pick<DirectionsTarget, "latitude" | "longitude">) {
  return (
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    typeof longitude === "number" &&
    Number.isFinite(longitude)
  );
}

export function buildNaverMapUrl(target: DirectionsTarget) {
  const query = getDestinationQuery(target);
  const hasDestinationCoordinates = hasCoordinates(target);

  if (query) {
    const encodedQuery = encodeURIComponent(query);
    const centerQuery = hasDestinationCoordinates
      ? `?c=${target.longitude},${target.latitude},15,0,0,0,dh`
      : "";

    return `https://map.naver.com/v5/search/${encodedQuery}${centerQuery}`;
  }

  if (hasDestinationCoordinates) {
    return `https://map.naver.com/v5/?c=${target.longitude},${target.latitude},15,0,0,0,dh`;
  }

  return null;
}

export function buildKakaoMapUrl(target: DirectionsTarget) {
  const query = getDestinationQuery(target);
  const hasDestinationCoordinates = hasCoordinates(target);

  if (query && hasDestinationCoordinates) {
    return `https://map.kakao.com/link/map/${encodeURIComponent(query)},${target.latitude},${target.longitude}`;
  }

  if (query) {
    return `https://map.kakao.com/link/search/${encodeURIComponent(query)}`;
  }

  if (hasDestinationCoordinates) {
    return `https://map.kakao.com/link/map/${encodeURIComponent("목적지")},${target.latitude},${target.longitude}`;
  }

  return null;
}

export function buildTmapUrl(target: DirectionsTarget) {
  const query = getDestinationQuery(target);

  if (query) {
    return `https://www.tmap.co.kr/search?query=${encodeURIComponent(query)}`;
  }

  if (hasCoordinates(target)) {
    return `https://www.tmap.co.kr/search?query=${encodeURIComponent(
      `${target.latitude},${target.longitude}`,
    )}`;
  }

  return null;
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
      className="h-4 w-4 text-[#8A857D]"
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
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EAE3D8] text-base font-semibold text-[#4D5748]">
        {option.iconLabel}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-lg font-semibold text-[#3F3F3B]">
          {option.label}
        </span>
        <span className="block text-sm leading-5 text-[#6B6B68]">
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
  const options = useMemo<DirectionsOption[]>(
    () => [
      {
        label: "TMAP",
        helperText: "티맵 검색으로 열기",
        iconLabel: "T",
        url: buildTmapUrl({ name, address, latitude, longitude }),
      },
      {
        label: "네이버 지도",
        helperText: "네이버 지도에서 목적지 보기",
        iconLabel: "N",
        url: buildNaverMapUrl({ name, address, latitude, longitude }),
      },
      {
        label: "카카오맵",
        helperText: "카카오맵에서 목적지 보기",
        iconLabel: "K",
        url: buildKakaoMapUrl({ name, address, latitude, longitude }),
      },
    ],
    [address, latitude, longitude, name],
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
    "flex min-h-16 w-full items-center gap-4 rounded-2xl border border-[#EFEAE2] bg-[#F8F6F2] px-4 py-3 text-left transition hover:border-[#A8B2A1] hover:bg-[#F1EDE5] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#4D5748]";

  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center px-0 sm:items-end sm:px-5 sm:py-6">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-[#2F362D]/40 backdrop-blur-[2px]"
        onClick={onClose}
        tabIndex={-1}
        aria-label="배경 클릭으로 길찾기 닫기"
      />
      <div
        className="relative z-10 w-full max-w-md rounded-t-2xl border border-[#E5E0D8] bg-[#FCFBF8] px-5 pb-5 pt-4 shadow-[0_24px_80px_rgba(47,54,45,0.24)] sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="directions-sheet-title"
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#D9D2C8] sm:hidden" />

        <div className="flex items-center justify-between gap-4">
          <h2
            id="directions-sheet-title"
            className="text-2xl font-semibold tracking-normal text-[#3F3F3B]"
          >
            길찾기
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#6B6B68] transition hover:bg-[#EAE3D8]/70 hover:text-[#3F3F3B] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#4D5748]"
            aria-label="길찾기 닫기"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {options.map((option) => (
            option.url ? (
              <a
                key={option.label}
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className={optionClassName}
              >
                <DirectionsOptionContent option={option} />
              </a>
            ) : (
              <button
                key={option.label}
                type="button"
                disabled
                className={`${optionClassName} cursor-not-allowed opacity-55 hover:border-[#EFEAE2] hover:bg-[#F8F6F2]`}
              >
                <DirectionsOptionContent option={option} />
              </button>
            )
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 min-h-12 w-full rounded-full border border-[#D9D2C8] px-5 py-2.5 text-base font-semibold text-[#4D5748] transition hover:border-[#A8B2A1] hover:bg-[#F8F6F2] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
