import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { mockPlaces } from "@/lib/mockPlaces";

type PlaceDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return mockPlaces.map((place) => ({
    id: place.id,
  }));
}

export async function generateMetadata({
  params,
}: PlaceDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const place = mockPlaces.find((item) => item.id === id);

  return {
    title: place ? `${place.name} | Re:Place` : "장소 상세 | Re:Place",
  };
}

export default async function PlaceDetailPage({ params }: PlaceDetailPageProps) {
  const { id } = await params;
  const place = mockPlaces.find((item) => item.id === id);

  if (!place) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <Link
        href="/explore"
        className="mb-6 inline-flex text-lg font-semibold text-[#4D5748] hover:text-[#3F3F3B]"
      >
        둘러보기로 돌아가기
      </Link>

      <article className="overflow-hidden rounded-3xl border border-[#E5E0D8] bg-[#FCFBF8] shadow-[0_18px_44px_rgba(77,87,72,0.07)]">
        <div className="relative aspect-[16/10] w-full bg-[#EAE3D8] md:aspect-[16/7]">
          <Image
            src={place.imageUrl}
            alt={`${place.name} 사진`}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </div>

        <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#EAE3D8] px-4 py-2 text-lg font-medium text-[#4D5748]">
                {place.category}
              </span>
              <span className="text-xl font-medium text-[#6B6B68]">
                {place.region}
              </span>
              <span className="rounded-full border border-[#E5E0D8] px-4 py-2 text-lg font-medium text-[#6B6B68]">
                {place.isPublic ? "공개" : "나만 보기"}
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight tracking-normal text-[#3F3F3B] sm:text-5xl">
                {place.name}
              </h1>
              <p className="text-2xl leading-10 text-[#6B6B68]">
                {place.shortReview}
              </p>
            </div>
          </div>

          <aside className="space-y-6 rounded-2xl bg-[#EAE3D8] p-5">
            <div>
              <p className="text-lg font-medium text-[#6B6B68]">
                다시 가고 싶은 마음
              </p>
              <p className="mt-2 text-2xl font-semibold leading-9 text-[#4D5748]">
                {place.revisitLevel}
              </p>
            </div>
            <div>
              <p className="text-lg font-medium text-[#6B6B68]">
                장소에 남은 단서
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {place.seniorTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#FCFBF8] px-3 py-2 text-base font-medium text-[#3F3F3B]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
