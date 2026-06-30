import Image from "next/image";
import Link from "next/link";
import styles from "@/components/HomeHero.module.css";
import { typography } from "@/components/typography";

const heroImageSrc = "/images/hero/replace-hero.jpg";

export default function HomeHero() {
  return (
    <section className="relative w-full overflow-hidden bg-page">
      <div className="relative mx-auto w-full max-w-7xl lg:grid lg:min-h-[660px] lg:grid-cols-[2fr_3fr]">
        <div className="relative z-10 flex min-h-[520px] items-center px-5 py-16 sm:px-8 sm:py-20 lg:min-h-[660px] lg:px-10 lg:py-24 xl:px-14">
          <div className="max-w-xl space-y-12">
            <p className={typography.eyebrow}>Re:Place · 나만의 장소 아카이브</p>

            <div className="space-y-7">
              <h1 className={`max-w-2xl ${typography.heroTitle}`}>
                좋았던 장소를
                <br />
                오래 간직하세요
              </h1>
              <p className={`max-w-[36rem] ${typography.heroDescription}`}>
                다시 찾고 싶은 여행지, 카페, 음식점, 숙소를
                <br className="hidden sm:inline" />
                나만의 장소 아카이브로 차분히 남겨보세요.
              </p>
            </div>

            <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:gap-5">
              <Link
                href="/places/new"
                className="inline-flex min-h-[3.25rem] w-full items-center justify-center rounded-full bg-brand px-8 py-3.5 text-[1.0625rem] font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover sm:w-auto"
              >
                기록 시작하기
              </Link>
              <Link
                href="/explore"
                className="inline-flex min-h-[3.25rem] w-full items-center justify-center rounded-full border border-default bg-surface/90 px-8 py-3.5 text-[1.0625rem] font-semibold text-link shadow-sm backdrop-blur-[1px] transition hover:border-brand-muted hover:bg-surface focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover sm:w-auto"
              >
                둘러보기
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 lg:relative lg:min-h-[660px]">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={heroImageSrc}
              alt="창가 햇살 아래 노트와 커피가 놓인 테이블"
              fill
              priority
              quality={90}
              sizes="(min-width: 1024px) 60vw, 100vw"
              className={`${styles.heroImage} object-cover object-[72%_center] lg:object-center`}
            />
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-page via-page/50 to-page/10 sm:via-page/40 sm:to-page/5 lg:from-page/75 lg:via-page/20 lg:to-transparent"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-28 bg-gradient-to-r from-page to-transparent lg:block"
          />
        </div>
      </div>
    </section>
  );
}
