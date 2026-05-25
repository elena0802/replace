import Image from "next/image";
import Link from "next/link";
import type { Place } from "@/lib/mockPlaces";

type PlaceCardProps = {
  place: Place;
};

export default function PlaceCard({ place }: PlaceCardProps) {
  return (
    <Link
      href={`/places/${place.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E5E0D8] bg-[#FCFBF8] shadow-[0_14px_34px_rgba(77,87,72,0.06)] transition hover:-translate-y-0.5 hover:border-[#A8B2A1] hover:shadow-[0_18px_44px_rgba(77,87,72,0.1)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
      aria-label={`${place.name} 상세 보기`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EAE3D8]">
        <Image
          src={place.imageUrl}
          alt={`${place.name} 사진`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-base font-medium">
          <span className="rounded-full bg-[#EAE3D8] px-3 py-1 text-[#4D5748]">
            {place.category}
          </span>
          <span className="text-[#6B6B68]">{place.region}</span>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold tracking-normal text-[#3F3F3B]">
            {place.name}
          </h3>
          <p className="text-lg leading-8 text-[#6B6B68]">{place.shortReview}</p>
        </div>
        <div className="mt-auto border-t border-[#EFEAE2] pt-4">
          <p className="text-base font-medium text-[#6B6B68]">
            다시 가고 싶은 마음
          </p>
          <p className="mt-1 text-lg font-semibold text-[#4D5748]">
            {place.revisitLevel}
          </p>
        </div>
      </div>
    </Link>
  );
}
