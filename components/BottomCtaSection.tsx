import Image from "next/image";
import Link from "next/link";

const bottomCtaImage = "/images/cta-image.jpg";

export default function BottomCtaSection() {
  return (
    <section className="overflow-hidden rounded-xl border border-default/80 bg-tint shadow-floating">
      <div className="grid lg:min-h-[360px] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="flex flex-col justify-center px-7 py-9 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
          <div className="max-w-xl space-y-5">
            <h2 className="text-[2rem] font-semibold leading-[1.16] tracking-normal text-ink sm:text-[2.5rem]">
              당신의 좋은 장소와 시간을 기록해보세요
            </h2>
            <p className="max-w-lg text-[17px] leading-8 text-stone">
              기록할수록 나만의 취향이 쌓이고, 다시 가고 싶은 순간이 쉽게
              찾아옵니다.
            </p>
          </div>
          <div className="mt-8">
            <Link
              href="/places/new"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-7 py-3 text-base font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover"
            >
              지금 시작하기
            </Link>
          </div>
        </div>

        <div className="relative min-h-[250px] overflow-hidden sm:min-h-[320px] lg:min-h-full">
          <Image
            src={bottomCtaImage}
            alt="햇살 아래 노트에 장소를 기록하는 오후"
            fill
            sizes="(min-width: 1024px) 620px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-bg-tint)_6%,transparent),color-mix(in_srgb,var(--color-bg-tint)_18%,transparent))] lg:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-bg-tint)_72%,transparent),color-mix(in_srgb,var(--color-bg-tint)_18%,transparent)_34%,color-mix(in_srgb,var(--color-bg-tint)_2%,transparent)_72%)]" />
        </div>
      </div>
    </section>
  );
}
