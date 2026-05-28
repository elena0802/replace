"use client";

import { useState } from "react";
import {
  getInitializedKakaoSdk,
  type KakaoShareFeedPayload,
} from "@/lib/kakao/loadKakaoSdk";
import type { PlaceRow } from "@/types/database";

const KAKAO_SHARE_ERROR_MESSAGE =
  "카카오톡 공유를 준비하지 못했어요. 잠시 후 다시 시도해주세요.";
const DEFAULT_SHARE_DESCRIPTION = "좋은 장소와 시간을 Re:Place에 기록했어요.";
const DEFAULT_SHARE_IMAGE_PATH = "/images/cta-image.jpg";
const kakaoJavascriptKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;

type KakaoShareButtonProps = {
  place: Pick<PlaceRow, "name" | "memory" | "image_url">;
  onError?: (message: string) => void;
};

function resolveAbsoluteWebUrl(source: string, fallbackPath = DEFAULT_SHARE_IMAGE_PATH) {
  try {
    const url = new URL(source, window.location.origin);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("Kakao Share requires an HTTP image URL.");
    }

    return url.toString();
  } catch {
    return new URL(fallbackPath, window.location.origin).toString();
  }
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "then" in value &&
    typeof value.then === "function"
  );
}

function createSharePayload(place: KakaoShareButtonProps["place"]) {
  const currentUrl = window.location.href;
  const link = {
    mobileWebUrl: currentUrl,
    webUrl: currentUrl,
  };

  return {
    objectType: "feed",
    content: {
      title: place.name.trim() || "Re:Place 장소 기록",
      description: place.memory.trim() || DEFAULT_SHARE_DESCRIPTION,
      imageUrl: resolveAbsoluteWebUrl(
        place.image_url?.trim() || DEFAULT_SHARE_IMAGE_PATH,
      ),
      link,
    },
    buttons: [
      {
        title: "Re:Place에서 보기",
        link,
      },
    ],
  } satisfies KakaoShareFeedPayload;
}

export default function KakaoShareButton({
  place,
  onError,
}: KakaoShareButtonProps) {
  const [isPreparing, setIsPreparing] = useState(false);

  async function handleShare() {
    if (isPreparing) {
      return;
    }

    onError?.("");

    const appKey = kakaoJavascriptKey?.trim();

    if (!appKey) {
      onError?.(KAKAO_SHARE_ERROR_MESSAGE);
      return;
    }

    setIsPreparing(true);

    try {
      const kakao = await getInitializedKakaoSdk(appKey);

      if (!kakao.Share?.sendDefault) {
        throw new Error("Kakao Share module is unavailable.");
      }

      const result = kakao.Share.sendDefault(createSharePayload(place));

      if (isPromiseLike(result)) {
        await result;
      }
    } catch (error) {
      console.error("Kakao share failed:", error);
      onError?.(KAKAO_SHARE_ERROR_MESSAGE);
    } finally {
      setIsPreparing(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      disabled={isPreparing}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#E2D2A3] bg-[#FFF7D6] px-5 py-3 text-lg font-semibold text-[#4A4123] transition hover:border-[#D6BE6A] hover:bg-[#FBEA98] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#D6BE6A] disabled:cursor-not-allowed disabled:opacity-70"
      aria-label={`${place.name} 카카오톡 공유하기`}
    >
      <span
        aria-hidden="true"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#FEE500] text-sm font-bold text-[#3B1E1E]"
      >
        톡
      </span>
      {isPreparing ? "공유 준비 중..." : "카카오톡 공유하기"}
    </button>
  );
}
