"use client";

import { useEffect, useState } from "react";
import DirectionsBottomSheet, {
  getDirectionsQuery,
} from "@/components/DirectionsBottomSheet";
import PlaceMap from "@/components/PlaceMap";

type CoordinateValue = number | string | null | undefined;

type PlaceLocationCardProps = {
  name?: string;
  address?: string | null;
  latitude?: CoordinateValue;
  longitude?: CoordinateValue;
};

function toMapCoordinate(value: CoordinateValue) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : null;
}

async function copyText(text: string) {
  try {
    await Promise.race([
      navigator.clipboard.writeText(text),
      new Promise<never>((_, reject) => {
        window.setTimeout(() => {
          reject(new Error("Clipboard write timed out."));
        }, 800);
      }),
    ]);
    return;
  } catch {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const didCopy = document.execCommand("copy");
    document.body.removeChild(textArea);

    if (!didCopy) {
      throw new Error("Fallback copy command failed.");
    }
  }
}

function LocationIcon() {
  return (
    <svg
      aria-hidden="true"
      className="mt-1 h-5 w-5 shrink-0 text-meta"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0 text-current"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 8V5.8C8 4.8 8.8 4 9.8 4h8.4c1 0 1.8.8 1.8 1.8v8.4c0 1-.8 1.8-1.8 1.8H16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M4 9.8C4 8.8 4.8 8 5.8 8h8.4c1 0 1.8.8 1.8 1.8v8.4c0 1-.8 1.8-1.8 1.8H5.8c-1 0-1.8-.8-1.8-1.8V9.8Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default function PlaceLocationCard({
  name,
  address,
  latitude = null,
  longitude = null,
}: PlaceLocationCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isDirectionsOpen, setIsDirectionsOpen] = useState(false);
  const trimmedAddress = address?.trim() ?? "";
  const mapLatitude = toMapCoordinate(latitude);
  const mapLongitude = toMapCoordinate(longitude);
  const hasDirectionsTarget = Boolean(
    getDirectionsQuery({ name, address, latitude, longitude }),
  );

  useEffect(() => {
    if (!isCopied) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsCopied(false);
    }, 1800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isCopied]);

  async function handleCopyAddress() {
    if (!trimmedAddress) {
      return;
    }

    try {
      await copyText(trimmedAddress);
      setIsCopied(true);
    } catch (error) {
      console.error("Address copy failed:", error);
    }
  }

  return (
    <section
      aria-labelledby="place-location-heading"
      className="space-y-5 border-t border-border-muted pt-8"
    >
      <h2 id="place-location-heading" className="text-sm font-normal text-meta">
        위치
      </h2>

      <PlaceMap latitude={mapLatitude} longitude={mapLongitude} />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-2.5 text-sm leading-6 text-stone sm:text-base sm:leading-7">
            <LocationIcon />
            <p>{trimmedAddress || "주소 정보가 아직 없어요."}</p>
          </div>

          <button
            type="button"
            onClick={handleCopyAddress}
            disabled={!trimmedAddress}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 self-start rounded-full px-3 py-2 text-sm font-medium text-link transition-colors duration-200 hover:bg-[color:var(--color-accent)]/45 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover disabled:cursor-not-allowed disabled:text-meta disabled:hover:bg-transparent"
          >
            <CopyIcon />
            {isCopied ? "복사됨" : "복사"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsDirectionsOpen(true)}
          disabled={!hasDirectionsTarget}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-default bg-transparent px-4 py-2.5 text-sm font-medium text-link transition-colors duration-200 hover:border-brand-muted hover:bg-subtle focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover disabled:cursor-not-allowed disabled:border-default disabled:text-meta disabled:hover:bg-transparent sm:w-auto"
        >
          길찾기
        </button>
      </div>

      <DirectionsBottomSheet
        isOpen={isDirectionsOpen}
        onClose={() => setIsDirectionsOpen(false)}
        name={name}
        address={address}
        latitude={latitude}
        longitude={longitude}
      />
    </section>
  );
}
