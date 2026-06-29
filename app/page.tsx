import Image from "next/image";
import Link from "next/link";
import BottomCtaSection from "@/components/BottomCtaSection";
import CollectionsSection from "@/components/CollectionsSection";
import FeaturedPlacesList from "@/components/FeaturedPlacesList";

const heroImageSrc = "/images/hero/replace-hero.jpg";

export default function Home() {
  return (
    <div className="flex w-full flex-col">
      <section className="relative w-full overflow-hidden">
        <div className="relative mx-auto min-h-[520px] w-full max-w-7xl sm:min-h-[580px] lg:min-h-[640px]">
          <Image
            src={heroImageSrc}
            alt="창가 햇살 아래 노트와 커피가 놓인 테이블"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[65%_center] lg:object-center"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-page via-page/92 to-page/15 sm:via-page/88 sm:to-transparent"
          />

          <div className="relative z-10 flex h-full min-h-[520px] items-center px-5 py-14 sm:min-h-[580px] sm:px-8 sm:py-16 lg:min-h-[640px] lg:px-10 lg:py-20">
            <div className="max-w-xl space-y-8">
              <p className="text-base font-medium text-link sm:text-lg">
                Re:Place · 좋은 장소와 시간을 기록하세요
              </p>
              <div className="space-y-5">
                <h1 className="max-w-2xl text-[2.35rem] font-semibold leading-[1.12] tracking-normal text-ink sm:text-[3.25rem] lg:text-[3.5rem] lg:leading-[1.08]">
                  좋은 장소와 시간을 기록하세요
                </h1>
                <p className="max-w-[34rem] text-[17px] leading-8 text-stone sm:text-lg sm:leading-8">
                  다시 가고 싶은 카페, 음식점, 공원, 여행지, 호텔을 나만의
                  아카이브로 남겨보세요.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/places/new"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-7 py-3 text-base font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover"
                >
                  장소 기록하기
                </Link>
                <Link
                  href="/explore"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-default bg-surface/90 px-7 py-3 text-base font-semibold text-link shadow-sm backdrop-blur-[1px] transition hover:border-brand-muted hover:bg-surface focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover"
                >
                  둘러보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-5 py-12 lg:px-8 lg:py-18">
        <FeaturedPlacesList />

        <CollectionsSection />

        <BottomCtaSection />
      </div>
    </div>
  );
}
