"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CollectionCard from "@/components/CollectionCard";
import CollectionGridSkeleton from "@/components/skeleton/CollectionGridSkeleton";
import EmptyState from "@/components/EmptyState";
import StatusMessage from "@/components/StatusMessage";
import { mapSupabaseError } from "@/lib/errors/userMessages";
import { getSessionUser } from "@/lib/auth/getSessionUser";
import {
  getPublicCollections,
  type CollectionListItem,
} from "@/lib/collections/getCollections";

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
    <section className="rounded-xl border border-default/70 bg-subtle/50 px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
      <div className="space-y-10">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-medium text-meta">컬렉션</p>
            <h2 className="text-[1.75rem] font-semibold leading-tight tracking-normal text-ink sm:text-[2rem] lg:text-[2.125rem]">
              좋아하는 장소를 모으면
              <br className="hidden sm:block" />
              하나의 취향이 됩니다
            </h2>
            <p className="text-base leading-7 text-stone sm:text-[1.0625rem] sm:leading-8">
              장소들을 모아 나만의 취향을 천천히 만들어보세요.
            </p>
          </div>
          <Link
            href="/collections"
            className="shrink-0 self-start text-sm font-semibold text-brand transition hover:text-link focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover sm:self-end"
          >
            전체 보기
          </Link>
        </header>

        {isLoading ? (
          <div className="-mx-5 overflow-hidden sm:mx-0">
            <CollectionGridSkeleton count={4} variant="carousel" />
          </div>
        ) : errorMessage ? (
          <StatusMessage tone="error">{errorMessage}</StatusMessage>
        ) : collections.length === 0 ? (
          <EmptyState
            className="border-dashed border-default/80 bg-page/90 py-10 shadow-none"
            title="아직 공개된 컬렉션이 없습니다."
            description="컬렉션을 만들거나 다른 이용자의 공개 컬렉션을 기다려보세요."
            actionHref="/collections"
            actionLabel={isLoggedIn ? "컬렉션 만들기" : "둘러보기"}
          />
        ) : (
          <div className="-mx-5 overflow-hidden sm:mx-0">
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 [scrollbar-width:none] sm:gap-5 sm:scroll-px-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
              {collections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  variant="carousel"
                  visibilityMode="public"
                  showDate={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
