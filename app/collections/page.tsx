import type { Metadata } from "next";
import Link from "next/link";
import CollectionsList from "@/components/CollectionsList";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "컬렉션 | Re:Place",
};

export default function CollectionsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <PageHeader
        eyebrow="컬렉션"
        title="좋아하는 장소를 모아보세요"
        description="나만의 장소 묶음과 공개된 아카이브를 함께 둘러봅니다."
        action={
          <Link
            href="/explore"
            className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#D7DED0] bg-[#FCFBF8] px-7 py-4 text-xl font-semibold text-[#4D5748] transition hover:bg-[#EAE3D8]/45 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
          >
            둘러보기
          </Link>
        }
      />

      <CollectionsList />
    </div>
  );
}
