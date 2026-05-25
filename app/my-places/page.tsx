import Link from "next/link";
import MyPlacesList from "@/components/MyPlacesList";

export default function MyPlacesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl space-y-3">
          <p className="text-lg font-medium text-[#4D5748]">내 장소</p>
          <h1 className="text-4xl font-semibold leading-tight tracking-normal text-[#3F3F3B]">
            나만의 장소 아카이브
          </h1>
          <p className="text-xl leading-9 text-[#6B6B68]">
            다시 꺼내 보고 싶은 좋은 시간과 장소 취향을 모아둡니다.
          </p>
        </div>
        <Link
          href="/places/new"
          className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#A8B2A1] px-7 py-4 text-xl font-semibold text-[#2F362D] shadow-[0_10px_24px_rgba(77,87,72,0.14)] transition hover:bg-[#4D5748] hover:text-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
        >
          새 장소 기록하기
        </Link>
      </div>

      {/* 로그인 도입 후 user_id 기준 필터링 필요 */}
      <MyPlacesList />
    </div>
  );
}
