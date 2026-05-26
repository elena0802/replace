"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import StatusMessage from "@/components/StatusMessage";
import { mockPlaces, type Place } from "@/lib/mockPlaces";
import { getPublicPlaces } from "@/lib/places/getPublicPlaces";
import type { PlaceRow } from "@/types/database";

type FeaturedPlace = {
  id: string;
  category: string;
  region: string;
  name: string;
  imageUrl: string | null;
  shortReview: string;
  revisitLevel: string;
  href: string | null;
};

function mapPlaceRowToFeaturedPlace(place: PlaceRow): FeaturedPlace {
  return {
    id: place.id,
    category: place.category,
    region: place.region,
    name: place.name,
    imageUrl: place.image_url,
    shortReview: place.memory,
    revisitLevel: place.revisit_level,
    href: `/places/${place.id}`,
  };
}

function mapMockPlaceToFeaturedPlace(place: Place): FeaturedPlace {
  return {
    id: place.id,
    category: place.category,
    region: place.region,
    name: place.name,
    imageUrl: place.imageUrl,
    shortReview: place.shortReview,
    revisitLevel: place.revisitLevel,
    href: null,
  };
}

function getFeaturedPublicPlaces(places: PlaceRow[]) {
  return [...places]
    .sort((a, b) => {
      const imagePriority = Number(Boolean(b.image_url)) - Number(Boolean(a.image_url));

      if (imagePriority !== 0) {
        return imagePriority;
      }

      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    })
    .slice(0, 3)
    .map(mapPlaceRowToFeaturedPlace);
}

const fallbackPlaces = mockPlaces
  .filter((place) => place.isPublic)
  .slice(0, 3)
  .map(mapMockPlaceToFeaturedPlace);

export default function FeaturedPlacesList() {
  const [places, setPlaces] = useState<FeaturedPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPlaces() {
      try {
        const publicPlaces = await getPublicPlaces();
        const featuredPlaces =
          publicPlaces.length > 0 ? getFeaturedPublicPlaces(publicPlaces) : fallbackPlaces;

        if (isMounted) {
          setPlaces(featuredPlaces);
          setErrorMessage("");
        }
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setErrorMessage(
            "공개 장소를 불러오지 못했습니다. Supabase 설정을 확인해주세요.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPlaces();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-base font-medium text-[#6B6B68]">
            공개 아카이브
          </p>
          <h2 className="mt-2 text-[2rem] font-semibold leading-tight tracking-normal text-[#3F3F3B]">
            다른 사람들이 남긴 좋은 시간
          </h2>
        </div>
        <Link
          href="/explore"
          className="text-base font-semibold text-[#6B6B68] transition hover:text-[#4D5748] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
        >
          전체 보기
        </Link>
      </div>

      {isLoading ? (
        <StatusMessage>공개된 장소를 불러오는 중...</StatusMessage>
      ) : errorMessage ? (
        <StatusMessage tone="error">{errorMessage}</StatusMessage>
      ) : (
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {places.map((place) => (
            <FeaturedPlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </section>
  );
}

function FeaturedPlaceCard({ place }: { place: FeaturedPlace }) {
  const cardContent = (
    <>
      <div className="relative h-[236px] w-full overflow-hidden bg-[#EAE3D8] sm:h-[252px] lg:h-[260px]">
        {place.imageUrl ? (
          <Image
            src={place.imageUrl}
            alt={`${place.name} 사진`}
            fill
            sizes="(min-width: 1024px) 340px, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-6 text-center text-base font-semibold leading-7 text-[#4D5748]">
            사진이 아직 없어요
          </div>
        )}
      </div>
      <div className="flex min-h-[270px] flex-col px-6 pb-6 pt-5 sm:px-7 sm:pb-7 sm:pt-6">
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-[#6B6B68]">
          <span className="rounded-full bg-[#EAE3D8]/80 px-3 py-1 text-[#4D5748]">
            {place.category}
          </span>
          <span>{place.region}</span>
        </div>
        <div className="mt-5 space-y-3">
          <h3 className="text-[1.45rem] font-semibold leading-snug tracking-normal text-[#3F3F3B]">
            {place.name}
          </h3>
          <p className="text-[17px] leading-8 text-[#6B6B68]">
            {place.shortReview}
          </p>
        </div>
        <div className="mt-auto border-t border-[#EFEAE2] pt-5">
          <p className="text-sm font-medium text-[#8A857D]">
            다시 가고 싶은 마음
          </p>
          <p className="mt-2 text-base font-semibold leading-7 text-[#4D5748]">
            {place.revisitLevel}
          </p>
        </div>
      </div>
    </>
  );

  const className =
    "overflow-hidden rounded-[24px] border border-[#E5E0D8]/80 bg-[#FCFBF8] shadow-[0_18px_38px_rgba(77,87,72,0.045)]";

  if (!place.href) {
    return <article className={className}>{cardContent}</article>;
  }

  return (
    <Link
      href={place.href}
      className={`${className} block focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]`}
      aria-label={`${place.name} 상세 보기`}
    >
      {cardContent}
    </Link>
  );
}
