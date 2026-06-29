import type { Metadata } from "next";
import Link from "next/link";
import PremiumCheckout from "@/components/PremiumCheckout";
import { PREMIUM_PRICE_LABEL } from "@/lib/payments/constants";

export const metadata: Metadata = {
  title: "요금제 | Re:Place",
  description: "Re:Place Free와 Premium 요금제를 비교하고 시작하세요.",
};

const freeFeatures = [
  "장소 기록하기",
  "대표 이미지 업로드",
  "공개 장소 둘러보기",
];
const premiumFeatures = [
  "Premium 배지 활성화",
  "좋아하는 장소를 더 오래 보관할 준비",
  "앞으로 추가될 프리미엄 기능 우선 적용",
];

export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="mb-10 max-w-3xl space-y-3">
        <p className="text-lg font-medium text-[#4D5748]">요금제</p>
        <h1 className="text-4xl font-semibold leading-tight tracking-normal text-[#3F3F3B] sm:text-5xl">
          Re:Place를 더 오래 기록하는 방법
        </h1>
        <p className="text-xl leading-9 text-[#6B6B68]">
          무료 기록은 그대로 유지하고, Premium으로 더 깊게 남길 수 있어요.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
        <section className="rounded-[28px] border border-[#E5E0D8] bg-[#FCFBF8] p-6 shadow-[0_18px_44px_rgba(77,87,72,0.08)] sm:p-8">
          <div className="space-y-4">
            <p className="text-lg font-semibold text-[#4D5748]">Re:Place Free</p>
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-normal text-[#3F3F3B]">
                무료
              </h2>
              <p className="text-lg leading-8 text-[#6B6B68]">
                나만의 장소 아카이브를 부담 없이 시작합니다.
              </p>
            </div>
          </div>

          <ul className="mt-7 space-y-3 text-base leading-7 text-[#5F625A]">
            {freeFeatures.map((feature) => (
              <li key={feature} className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#A8B2A1]" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/places/new"
            className="mt-8 inline-flex min-h-14 w-full items-center justify-center rounded-full border border-[#D8D1C6] bg-[#FCFBF8] px-7 py-4 text-lg font-semibold text-[#4D5748] transition hover:border-[#A8B2A1] hover:bg-[#F3EFE8] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
          >
            무료로 기록하기
          </Link>
        </section>

        <section className="rounded-[28px] border border-[#A8B2A1]/70 bg-[#FCFBF8] p-6 shadow-[0_22px_54px_rgba(77,87,72,0.12)] sm:p-8">
          <div className="space-y-4">
            <p className="text-lg font-semibold text-[#4D5748]">
              Re:Place Premium
            </p>
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-normal text-[#3F3F3B]">
                {PREMIUM_PRICE_LABEL}
              </h2>
              <p className="text-lg leading-8 text-[#6B6B68]">
                월 구독으로 Premium을 이용하고, 좋은 장소를 더 오래 간직해보세요.
              </p>
            </div>
          </div>

          <ul className="mt-7 space-y-3 text-base leading-7 text-[#5F625A]">
            {premiumFeatures.map((feature) => (
              <li key={feature} className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#87977F]" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <PremiumCheckout />
          </div>
        </section>
      </div>
    </div>
  );
}
