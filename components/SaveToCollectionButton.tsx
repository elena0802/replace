"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { withTimeout } from "@/lib/async/withTimeout";
import { getSessionUser } from "@/lib/auth/getSessionUser";
import {
  getCollections,
  type CollectionListItem,
} from "@/lib/collections/getCollections";
import {
  getSupabaseEnvironmentStatus,
  supabase,
} from "@/lib/supabase/client";

type SaveToCollectionButtonProps = {
  placeId: string;
};

export default function SaveToCollectionButton({
  placeId,
}: SaveToCollectionButtonProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [collections, setCollections] = useState<CollectionListItem[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasLoadedCollections, setHasLoadedCollections] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialState() {
      try {
        const user = await getSessionUser();

        if (!isMounted) {
          return;
        }

        setCurrentUser(user);

        if (!user) {
          setCollections([]);
          setIsSaved(false);
          setHasLoadedCollections(false);
          return;
        }

        const nextCollections = await withTimeout(
          getCollections(user.id),
          6000,
          "컬렉션 목록 조회 시간이 초과되었습니다.",
        );

        if (!isMounted) {
          return;
        }

        setCollections(nextCollections);
        setHasLoadedCollections(true);
        setSelectedCollectionId(
          (current) => current || nextCollections[0]?.id || "",
        );

        if (nextCollections.length === 0) {
          setIsSaved(false);
          return;
        }

        const collectionIds = nextCollections.map((collection) => collection.id);
        const { data, error } = await supabase
          .from("collection_places")
          .select("id")
          .eq("place_id", placeId)
          .in("collection_id", collectionIds)
          .limit(1)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (isMounted) {
          setIsSaved(Boolean(data));
        }
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setHasLoadedCollections(true);
          setIsSaved(false);
        }
      }
    }

    loadInitialState();

    return () => {
      isMounted = false;
    };
  }, [placeId]);

  async function openCollectionPicker() {
    const environment = getSupabaseEnvironmentStatus();

    if (!environment.configured) {
      return;
    }

    if (!currentUser) {
      router.push("/login");
      return;
    }

    setIsOpen(true);

    if (hasLoadedCollections) {
      return;
    }

    setIsLoading(true);

    try {
      const nextCollections = await withTimeout(
        getCollections(currentUser.id),
        6000,
        "컬렉션 목록 조회 시간이 초과되었습니다.",
      );
      setCollections(nextCollections);
      setHasLoadedCollections(true);
      setSelectedCollectionId(
        (current) => current || nextCollections[0]?.id || "",
      );
    } catch (error) {
      console.error(error);
      setHasLoadedCollections(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveToCollection() {
    if (!selectedCollectionId || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase.from("collection_places").insert({
        collection_id: selectedCollectionId,
        place_id: placeId,
      });

      if (error && error.code !== "23505") {
        throw error;
      }

      setIsSaved(true);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }

  const buttonLabel = isSaving
    ? "저장 중..."
    : isSaved
      ? "컬렉션에 저장됨"
      : "컬렉션에 저장";

  const buttonClassName = isSaved
    ? "inline-flex min-h-12 min-w-44 items-center justify-center rounded-full border border-[#A8B2A1] bg-[#EAE3D8] px-5 py-3 text-lg font-semibold text-[#3F4A3D] transition hover:bg-[#DDE6D8] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
    : "inline-flex min-h-12 min-w-44 items-center justify-center rounded-full border border-[#D7DED0] bg-[#FCFBF8] px-5 py-3 text-lg font-semibold text-[#4D5748] transition hover:bg-[#EAE3D8]/45 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]";

  return (
    <>
      <button
        type="button"
        onClick={openCollectionPicker}
        className={buttonClassName}
      >
        {buttonLabel}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 flex items-end bg-[#3F3F3B]/35 px-4 py-4 sm:items-center sm:justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="컬렉션에 저장"
        >
          <div className="w-full max-w-md rounded-3xl border border-[#E5E0D8] bg-[#FCFBF8] p-5 shadow-[0_24px_70px_rgba(63,63,59,0.24)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-[#3F3F3B]">
                  컬렉션에 저장
                </h2>
                <p className="mt-2 text-lg leading-8 text-[#6B6B68]">
                  이 장소를 담을 컬렉션을 선택해주세요.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-[#E5E0D8] text-xl font-semibold text-[#6B6B68] transition hover:bg-[#F8F6F2] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#4D5748]"
                aria-label="닫기"
              >
                ×
              </button>
            </div>

            {isLoading ? (
              <p className="mt-6 rounded-2xl bg-[#F8F6F2] px-4 py-5 text-center text-lg font-semibold text-[#4D5748]">
                컬렉션을 불러오는 중...
              </p>
            ) : collections.length === 0 ? (
              <div className="mt-6 rounded-2xl bg-[#F8F6F2] px-4 py-5">
                <p className="text-lg font-semibold text-[#3F3F3B]">
                  아직 컬렉션이 없어요.
                </p>
                <p className="mt-2 text-base leading-7 text-[#6B6B68]">
                  컬렉션을 먼저 만들고 다시 저장해보세요.
                </p>
                <Link
                  href="/collections"
                  className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-[#A8B2A1] px-5 py-2.5 text-base font-semibold text-[#2F362D]"
                >
                  컬렉션 만들기
                </Link>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {collections.map((collection) => (
                  <label
                    key={collection.id}
                    className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#E5E0D8] bg-[#F8F6F2] p-4 transition has-[:checked]:border-[#A8B2A1] has-[:checked]:bg-[#EAE3D8]/55"
                  >
                    <input
                      type="radio"
                      name="collection"
                      value={collection.id}
                      checked={selectedCollectionId === collection.id}
                      onChange={() => setSelectedCollectionId(collection.id)}
                      className="mt-1 size-5 accent-[#4D5748]"
                    />
                    <span className="min-w-0">
                      <span className="block text-lg font-semibold leading-7 text-[#3F3F3B]">
                        {collection.name}
                      </span>
                      <span className="mt-1 block text-base leading-7 text-[#6B6B68]">
                        {collection.placeCount}곳
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#D7DED0] px-5 py-3 text-lg font-semibold text-[#4D5748] transition hover:bg-[#EAE3D8]/45"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSaveToCollection}
                disabled={
                  collections.length === 0 || !selectedCollectionId || isSaving
                }
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#A8B2A1] px-5 py-3 text-lg font-semibold text-[#2F362D] shadow-[0_10px_24px_rgba(77,87,72,0.14)] transition hover:bg-[#4D5748] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
