import Image from "next/image";
import Link from "next/link";
import BottomCtaSection from "@/components/BottomCtaSection";
import CollectionsSection from "@/components/CollectionsSection";
import FeaturedPlacesList from "@/components/FeaturedPlacesList";

const heroImages = {
  main: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  coffee:
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
  garden:
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80",
};

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-5 py-12 lg:px-8 lg:py-18">
      <section className="grid overflow-hidden gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(440px,1fr)] lg:items-center lg:gap-16 lg:overflow-visible">
        <div className="max-w-xl space-y-8">
          <p className="text-base font-medium text-link sm:text-lg">
            Re:Place · 좋은 장소와 시간을 기록하세요
          </p>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-[2.625rem] font-semibold leading-[1.1] tracking-normal text-ink sm:text-[3.5rem] lg:text-[3.75rem]">
              좋은 장소와 시간을 기록하세요
            </h1>
            <p className="max-w-[34rem] text-[17px] leading-8 text-stone">
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
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-default bg-surface px-7 py-3 text-base font-semibold text-link shadow-sm transition hover:border-brand-muted hover:bg-subtle focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover"
            >
              둘러보기
            </Link>
          </div>
        </div>
        <div className="relative mx-auto h-[500px] w-full max-w-[560px] sm:h-[540px] lg:mx-0 lg:h-[520px]">
          <div className="absolute left-1 top-8 h-[360px] w-[67%] max-w-[340px] -rotate-[1.5deg] overflow-hidden rounded-xl bg-[color:var(--color-accent)] shadow-floating sm:left-4 sm:h-[420px]">
            <Image
              src={heroImages.main}
              alt="햇살이 드는 카페 창가"
              fill
              priority
              sizes="(min-width: 1024px) 340px, 67vw"
              className="object-cover"
            />
          </div>
          <div className="absolute right-2 top-2 h-[150px] w-[150px] rotate-[2deg] overflow-hidden rounded-xl bg-[color:var(--color-accent)] shadow-lg sm:right-8 sm:h-[180px] sm:w-[180px]">
            <Image
              src={heroImages.coffee}
              alt="따뜻한 커피가 놓인 테이블"
              fill
              sizes="(min-width: 1024px) 180px, 150px"
              className="object-cover"
            />
          </div>
          <div className="absolute right-0 top-[205px] h-[205px] w-[150px] -rotate-[1deg] overflow-hidden rounded-xl bg-[color:var(--color-accent)] shadow-lg sm:right-3 sm:top-[220px] sm:h-[230px] sm:w-[180px]">
            <Image
              src={heroImages.garden}
              alt="초록빛이 감도는 산책길"
              fill
              sizes="(min-width: 1024px) 180px, 150px"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-4 right-1 z-10 w-[min(330px,calc(100%-28px))] rounded-xl border border-border-muted bg-surface p-6 shadow-floating sm:right-8 sm:p-7 lg:bottom-2 lg:right-10">
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="text-sm font-medium text-stone">
                  Archive note
                </p>
                <p className="text-xl font-semibold leading-snug text-link sm:text-2xl">
                  머물렀던 순간과 장소 취향을 차분히 모아두는 곳
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-link">
                {["카페", "공원", "호텔"].map((item) => (
                  <div
                    key={item}
                    className="rounded-full bg-[color:var(--color-accent)] px-3 py-2 text-sm font-medium"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedPlacesList />

      <CollectionsSection />

      <BottomCtaSection />
    </div>
  );
}
