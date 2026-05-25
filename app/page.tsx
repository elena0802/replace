import Link from "next/link";
import PlaceCard from "@/components/PlaceCard";
import { mockPlaces } from "@/lib/mockPlaces";

export default function Home() {
  const recentPublicPlaces = mockPlaces
    .filter((place) => place.isPublic)
    .slice(0, 3);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-5 py-12 lg:px-8 lg:py-18">
      <section className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div className="space-y-8">
          <p className="text-lg font-medium text-[#4D5748]">
            Re:Place · 좋은 장소와 시간을 기록하세요
          </p>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-[#3F3F3B] sm:text-5xl">
              좋은 장소와 시간을 기록하세요
            </h1>
            <p className="max-w-2xl text-xl leading-9 text-[#6B6B68]">
              다시 가고 싶은 카페, 음식점, 공원, 여행지, 호텔을 나만의
              아카이브로 남겨보세요.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/places/new"
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#A8B2A1] px-8 py-4 text-xl font-semibold text-[#2F362D] shadow-[0_10px_24px_rgba(77,87,72,0.14)] transition hover:bg-[#4D5748] hover:text-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
            >
              장소 기록하기
            </Link>
            <Link
              href="/explore"
              className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#E5E0D8] bg-[#FCFBF8] px-8 py-4 text-xl font-semibold text-[#4D5748] shadow-[0_8px_20px_rgba(77,87,72,0.06)] transition hover:border-[#A8B2A1] hover:bg-[#EAE3D8] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
            >
              둘러보기
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-[#E5E0D8] bg-[#FCFBF8] p-6 shadow-[0_18px_44px_rgba(77,87,72,0.07)]">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-lg font-medium text-[#6B6B68]">Archive note</p>
              <p className="text-3xl font-semibold leading-snug text-[#4D5748]">
                머물렀던 순간과 장소 취향을 차분히 모아두는 곳
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-[#4D5748]">
              {["카페", "공원", "호텔"].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-[#EAE3D8] px-3 py-4 text-lg font-medium"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-lg font-medium text-[#4D5748]">
              공개 아카이브
            </p>
            <h2 className="mt-1 text-3xl font-semibold tracking-normal text-[#3F3F3B]">
              다른 사람들이 남긴 좋은 시간
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-lg font-semibold text-[#4D5748] hover:text-[#3F3F3B]"
          >
            전체 보기
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {recentPublicPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </section>
    </div>
  );
}
