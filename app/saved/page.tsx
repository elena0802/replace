import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SavedPlacesList from "@/components/SavedPlacesList";

export const metadata: Metadata = {
  title: "저장한 장소 | Re:Place",
};

export default function SavedPlacesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <PageHeader
        eyebrow="저장한 장소"
        title="다시 가고 싶은 장소 모음"
        description="둘러보다 마음에 남은 공개 장소를 최신 저장순으로 모아봅니다."
        action={
          <Link
            href="/explore"
            className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#D7DED0] bg-[#FCFBF8] px-7 py-4 text-xl font-semibold text-[#4D5748] transition hover:bg-[#EAE3D8]/45 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
          >
            둘러보기
          </Link>
        }
      />

      <SavedPlacesList />
    </div>
  );
}
