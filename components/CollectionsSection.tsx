"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CollectionCoverImage from "@/components/CollectionCoverImage";
import CollectionGridSkeleton from "@/components/skeleton/CollectionGridSkeleton";
import EmptyState from "@/components/EmptyState";
import StatusMessage from "@/components/StatusMessage";
import { mapSupabaseError } from "@/lib/errors/userMessages";
import { getSessionUser } from "@/lib/auth/getSessionUser";
import {
  getPublicCollections,
  type CollectionListItem,
} from "@/lib/collections/getCollections";

function PublicCollectionCard({
  collection,
}: {
  collection: CollectionListItem;
}) {
  return (
    <Link
      href={`/collections/${collection.id}`}
      className="group flex w-[238px] shrink-0 flex-col overflow-hidden rounded-lg border border-default/80 bg-surface shadow-card transition hover:-translate-y-0.5 hover:border-brand-muted hover:shadow-floating focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover sm:w-[252px]"
      aria-label={`${collection.name} 컬렉션 보기`}
    >
      <CollectionCoverImage
        imageUrl={collection.coverImageUrl}
        title={collection.name}
        className="rounded-none border-0"
        placeholderTitle={
          collection.placeCount === 0
            ? "아직 담긴 장소가 없어요"
            : "커버 이미지가 없어요"
        }
        placeholderDescription={
          collection.placeCount === 0
            ? "장소를 담으면 커버가 채워집니다"
            : "이미지가 있는 장소를 담으면 커버가 채워집니다"
        }
      />
      <div className="space-y-3 px-5 pb-5 pt-4">
        <p className="text-sm font-medium text-meta">
          {collection.placeCount}곳 · 공개
        </p>
        <h3 className="min-h-[3.25rem] text-[1.18rem] font-semibold leading-snug tracking-normal text-ink">
          {collection.name}
        </h3>
        <p className="line-clamp-2 text-sm leading-7 text-stone">
          {collection.description || "설명 없이 조용히 모아둔 컬렉션"}
        </p>
      </div>
    </Link>
  );
}

export default function CollectionsSection() {
  const [collections, setCollections] = useState<CollectionListItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCollections() {
      try {
        const user = await getSessionUser();
        const publicCollections = await getPublicCollections(user?.id ?? null);

        if (isMounted) {
          setIsLoggedIn(Boolean(user));
          setCollections(publicCollections.slice(0, 8));
          setErrorMessage("");
        }
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setErrorMessage(mapSupabaseError(error, "publicCollections"));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCollections();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-base font-medium text-stone">
            사람들의 취향이 담긴 컬렉션
          </p>
          <h2 className="mt-2 max-w-2xl text-[1.8rem] font-semibold leading-tight tracking-normal text-ink sm:text-[2rem]">
            비슷한 순간들이 모이면 하나의 취향이 됩니다
          </h2>
        </div>
        <Link
          href="/collections"
          className="text-base font-semibold text-stone transition hover:text-link focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover"
        >
          전체 보기
        </Link>
      </div>

      {isLoading ? (
        <CollectionGridSkeleton count={4} variant="carousel" />
      ) : errorMessage ? (
        <StatusMessage tone="error">{errorMessage}</StatusMessage>
      ) : collections.length === 0 ? (
        <EmptyState
          title="아직 공개된 컬렉션이 없습니다."
          description="컬렉션을 만들거나 다른 이용자의 공개 컬렉션을 기다려보세요."
          actionHref="/collections"
          actionLabel={isLoggedIn ? "컬렉션 만들기" : "둘러보기"}
        />
      ) : (
        <div className="overflow-hidden">
          <div className="flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] sm:gap-6 [&::-webkit-scrollbar]:hidden">
            {collections.map((collection) => (
              <PublicCollectionCard
                key={collection.id}
                collection={collection}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
