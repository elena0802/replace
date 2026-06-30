import Link from "next/link";
import MyPlacesList from "@/components/MyPlacesList";
import PageHeader from "@/components/PageHeader";

export default function MyPlacesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <PageHeader
        eyebrow="내 장소"
        title="내 장소 기록"
        description="다시 꺼내 보고 싶은 좋은 시간과 장소 취향을 모아둡니다."
        action={
          <Link
            href="/places/new"
            className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#A8B2A1] px-7 py-4 text-xl font-semibold text-[#2F362D] shadow-[0_10px_24px_rgba(77,87,72,0.14)] transition hover:bg-[#4D5748] hover:text-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
          >
            새 장소 기록하기
          </Link>
        }
      />

      <MyPlacesList />
    </div>
  );
}
