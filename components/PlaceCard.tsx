import Link from "next/link";
import type { Place } from "@/lib/mockPlaces";
import type { PlaceRow } from "@/types/database";

type PlaceCardProps = {
  place: Place | PlaceRow;
  href?: string | null;
};

function normalizePlace(place: Place | PlaceRow) {
  if ("imageUrl" in place) {
    return {
      id: place.id,
      name: place.name,
      category: place.category,
      region: place.region,
      imageUrl: place.imageUrl,
      memory: place.shortReview,
      revisitLevel: place.revisitLevel,
    };
  }

  return {
    id: place.id,
    name: place.name,
    category: place.category,
    region: place.region,
    imageUrl: place.image_url,
    memory: place.memory,
    revisitLevel: place.revisit_level,
  };
}

export default function PlaceCard({ place, href }: PlaceCardProps) {
  const normalizedPlace = normalizePlace(place);
  const cardHref = href === undefined ? `/places/${normalizedPlace.id}` : href;

  const cardContent = (
    <>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EAE3D8]">
        {normalizedPlace.imageUrl ? (
          <div
            className="h-full w-full bg-cover bg-center transition duration-300 group-hover:scale-105"
            role="img"
            aria-label={`${normalizedPlace.name} 사진`}
            style={{ backgroundImage: `url("${normalizedPlace.imageUrl}")` }}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center">
            <span className="text-xl font-semibold text-[#4D5748]">
              사진이 아직 없어요
            </span>
            <span className="text-base font-medium leading-7 text-[#6B6B68]">
              좋은 순간을 사진으로 남겨보세요
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-base font-medium">
          <span className="rounded-full bg-[#EAE3D8] px-3 py-1 text-[#4D5748]">
            {normalizedPlace.category}
          </span>
          <span className="text-[#6B6B68]">{normalizedPlace.region}</span>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold tracking-normal text-[#3F3F3B]">
            {normalizedPlace.name}
          </h3>
          <p className="text-lg leading-8 text-[#6B6B68]">
            {normalizedPlace.memory}
          </p>
        </div>
        <div className="mt-auto border-t border-[#EFEAE2] pt-4">
          <p className="text-base font-medium text-[#6B6B68]">
            다시 가고 싶은 마음
          </p>
          <p className="mt-1 text-lg font-semibold text-[#4D5748]">
            {normalizedPlace.revisitLevel}
          </p>
        </div>
      </div>
    </>
  );

  const className =
    "group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E5E0D8] bg-[#FCFBF8] shadow-[0_14px_34px_rgba(77,87,72,0.06)] transition hover:-translate-y-0.5 hover:border-[#A8B2A1] hover:shadow-[0_18px_44px_rgba(77,87,72,0.1)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]";

  if (!cardHref) {
    return <article className={className}>{cardContent}</article>;
  }

  return (
    <Link
      href={cardHref}
      className={className}
      aria-label={`${normalizedPlace.name} 상세 보기`}
    >
      {cardContent}
    </Link>
  );
}
