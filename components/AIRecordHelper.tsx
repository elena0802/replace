"use client";

import { useRef, useState } from "react";

const recordHelperFallbackMessage =
  "지금은 기록을 다듬지 못했어요. 잠시 후 다시 시도해주세요.";
const recordHelperInputMessage =
  "장소명과 한 줄 기록을 먼저 입력해주세요.";
const recordHelperShortMemoMessage =
  "조금만 더 적어주시면 자연스럽게 다듬을 수 있어요.";
const recordHelperAppliedMessage = "다듬은 기록이 입력창에 적용됐어요.";
const minimumMemoLength = 5;
const maximumMemoLength = 500;

type RecordHelperResponse = {
  error?: unknown;
  suggestion?: unknown;
};

type AIRecordHelperProps = {
  address?: string;
  category?: string;
  disabled?: boolean;
  memo: string;
  onApply: (suggestion: string) => void;
  placeName: string;
};

export default function AIRecordHelper({
  address = "",
  category = "",
  disabled = false,
  memo,
  onApply,
  placeName,
}: AIRecordHelperProps) {
  const [suggestion, setSuggestion] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [appliedMessage, setAppliedMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const requestInFlightRef = useRef(false);
  const trimmedPlaceName = placeName.trim();
  const trimmedMemo = memo.trim();
  const canGenerate =
    Boolean(trimmedPlaceName) && trimmedMemo.length >= minimumMemoLength;
  const shouldShowShortMemoGuide =
    trimmedMemo.length > 0 && trimmedMemo.length < minimumMemoLength;
  const shouldShowMemoLimitGuide = trimmedMemo.length > maximumMemoLength;
  const isGenerateDisabled = disabled || isLoading || !canGenerate;
  const isResultActionDisabled = disabled || isLoading;

  async function handleGenerateSuggestion() {
    if (disabled || isLoading || requestInFlightRef.current) {
      return;
    }

    if (!trimmedPlaceName || !trimmedMemo) {
      setErrorMessage(recordHelperInputMessage);
      return;
    }

    if (trimmedMemo.length < minimumMemoLength) {
      setErrorMessage(recordHelperShortMemoMessage);
      return;
    }

    const memoForRequest = trimmedMemo.slice(0, maximumMemoLength);

    requestInFlightRef.current = true;
    setIsLoading(true);
    setErrorMessage("");
    setAppliedMessage("");

    try {
      const response = await fetch("/api/ai/record-helper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          category,
          memo: memoForRequest,
          placeName: trimmedPlaceName,
        }),
      });
      const data = (await response.json()) as RecordHelperResponse;

      if (!response.ok || typeof data.suggestion !== "string") {
        const nextErrorMessage =
          typeof data.error === "string"
            ? data.error
            : recordHelperFallbackMessage;

        throw new Error(nextErrorMessage);
      }

      const nextSuggestion = data.suggestion.trim();

      if (!nextSuggestion) {
        throw new Error(recordHelperFallbackMessage);
      }

      setSuggestion(nextSuggestion);
    } catch (error) {
      const nextErrorMessage =
        error instanceof Error && error.message
          ? error.message
          : recordHelperFallbackMessage;

      setErrorMessage(nextErrorMessage);
    } finally {
      setIsLoading(false);
      requestInFlightRef.current = false;
    }
  }

  function handleApplySuggestion() {
    if (!suggestion || isResultActionDisabled) {
      return;
    }

    onApply(suggestion);
    setErrorMessage("");
    setAppliedMessage(recordHelperAppliedMessage);
  }

  return (
    <div className="rounded-2xl border border-[#E5E0D8] bg-[#FFFDF8] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-base leading-7 text-[#6B6B68]">
          짧게 적은 내용을 따뜻한 기록 문장으로 조용히 다듬어드려요.
        </p>
        <button
          type="button"
          onClick={handleGenerateSuggestion}
          disabled={isGenerateDisabled}
          className="min-h-12 rounded-full border border-[#DCD5C8] bg-[#F8F6F2] px-5 py-3 text-base font-semibold text-[#4D5748] transition hover:border-[#4D5748] hover:bg-[#EAE3D8] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "기록을 다듬는 중..." : "AI가 기록 다듬기"}
        </button>
      </div>

      {shouldShowShortMemoGuide && (
        <p className="mt-3 text-base leading-7 text-[#7A5B3A]">
          {recordHelperShortMemoMessage}
        </p>
      )}

      {shouldShowMemoLimitGuide && (
        <p className="mt-3 text-base leading-7 text-[#6B6B68]">
          긴 기록은 앞 500자까지만 다듬기에 사용돼요.
        </p>
      )}

      {isLoading && (
        <p className="mt-3 text-base leading-7 text-[#6B6B68]" role="status">
          문장을 차분히 정리하는 중입니다.
        </p>
      )}

      {errorMessage && (
        <p
          className="mt-3 rounded-2xl border border-[#E5C8BA] bg-[#FFF8F4] px-4 py-3 text-base font-semibold leading-7 text-[#7A4B3A]"
          role="alert"
        >
          {errorMessage}
        </p>
      )}

      {suggestion && (
        <div className="mt-4 rounded-2xl border border-[#E5E0D8] bg-white p-4">
          <p className="text-lg font-semibold text-[#3F3F3B]">다듬은 기록</p>
          <p className="mt-1 text-base leading-7 text-[#6B6B68]">
            마음에 들면 적용해보세요.
          </p>
          <p className="mt-3 whitespace-pre-line text-lg leading-8 text-[#4D5748]">
            {suggestion}
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleApplySuggestion}
              disabled={isResultActionDisabled}
              className="min-h-12 rounded-full bg-[#A8B2A1] px-5 py-3 text-base font-semibold text-[#2F362D] transition hover:bg-[#4D5748] hover:text-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-[#A8B2A1] disabled:hover:text-[#2F362D]"
            >
              적용하기
            </button>
            <button
              type="button"
              onClick={handleGenerateSuggestion}
              disabled={isGenerateDisabled}
              className="min-h-12 rounded-full border border-[#DCD5C8] bg-[#FFFDF8] px-5 py-3 text-base font-semibold text-[#4D5748] transition hover:border-[#4D5748] hover:bg-[#F8F6F2] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748] disabled:cursor-not-allowed disabled:opacity-70"
            >
              다시 다듬기
            </button>
          </div>
          {appliedMessage && (
            <p className="mt-3 text-base font-semibold leading-7 text-[#4D5748]">
              {appliedMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
