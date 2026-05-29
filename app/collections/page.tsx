import type { Metadata } from "next";
import Link from "next/link";
import CollectionsList from "@/components/CollectionsList";

export const metadata: Metadata = {
  title: "내 컬렉션 | Re:Place",
};

export default function CollectionsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl space-y-3">
          <p className="text-lg font-medium text-[#4D5748]">내 컬렉션</p>
          <h1 className="text-4xl font-semibold leading-tight tracking-normal text-[#3F3F3B]">
            장소를 기억의 결로 묶기
          </h1>
          <p className="text-xl leading-9 text-[#6B6B68]">
            북마크와 별도로, 나만의 기준으로 장소를 차분히 정리합니다.
          </p>
        </div>
        <Link
          href="/explore"
          className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#D7DED0] bg-[#FCFBF8] px-7 py-4 text-xl font-semibold text-[#4D5748] transition hover:bg-[#EAE3D8]/45 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
        >
          둘러보기
        </Link>
      </div>

      <CollectionsList />
    </div>
  );
}
