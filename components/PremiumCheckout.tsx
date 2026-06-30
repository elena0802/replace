"use client";

import { useState } from "react";

export default function PremiumCheckout() {
  const [showNotice, setShowNotice] = useState(false);

  function handleStartPremium() {
    setShowNotice(true);
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleStartPremium}
        className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-brand px-7 py-4 text-lg font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover disabled:cursor-not-allowed disabled:opacity-70"
      >
        Premium 시작하기
      </button>

      <div
        aria-live="polite"
        className={`grid transition-all duration-slow ease-emphasis motion-reduce:transition-none ${
          showNotice
            ? "mt-4 grid-rows-[1fr] opacity-100"
            : "mt-0 grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div
            role="status"
            className="rounded-xl border border-default bg-subtle p-4 text-stone"
          >
            <p className="text-base font-semibold text-ink">준비 중입니다.</p>
            <div className="mt-2 space-y-1 text-sm leading-relaxed sm:text-base sm:leading-relaxed">
              <p>Premium은 현재 준비 중입니다.</p>
              <p>
                좋은 장소를 더 오래 간직할 수 있는 기능을 곧 만나보실 수
                있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
