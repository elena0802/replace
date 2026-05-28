"use client";

import { useEffect, useState } from "react";
import PlaceMap from "@/components/PlaceMap";

type PlaceLocationCardProps = {
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

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
      className="h-5 w-5 shrink-0 text-[#4D5748]"
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
      className="h-4 w-4 shrink-0"
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
  address,
  latitude = null,
  longitude = null,
}: PlaceLocationCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const trimmedAddress = address?.trim() ?? "";

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
    <section className="rounded-3xl border border-[#E5E0D8] bg-[#FCFBF8] p-5 shadow-[0_14px_34px_rgba(77,87,72,0.06)] sm:p-6">
      <h2 className="mb-4 text-2xl font-semibold text-[#3F3F3B]">위치</h2>

      <PlaceMap latitude={latitude} longitude={longitude} />

      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-[#EFEAE2] bg-[#F8F6F2] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-2 text-lg font-medium leading-8 text-[#3F3F3B]">
          <LocationIcon />
          <p>{trimmedAddress || "주소 정보가 아직 없어요."}</p>
        </div>

        <button
          type="button"
          onClick={handleCopyAddress}
          disabled={!trimmedAddress}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-[#D9D2C8] bg-[#FCFBF8] px-4 py-2 text-base font-semibold text-[#4D5748] transition hover:border-[#A8B2A1] hover:bg-[#EAE3D8] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CopyIcon />
          {isCopied ? "복사됨" : "복사"}
        </button>
      </div>

      <button
        type="button"
        onClick={() => console.log("TODO: directions")}
        className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#A8B2A1] bg-transparent px-5 py-3 text-lg font-semibold text-[#4D5748] transition hover:border-[#4D5748] hover:bg-[#EAE3D8] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
      >
        길찾기
      </button>
    </section>
  );
}
