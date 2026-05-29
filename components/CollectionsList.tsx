"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import CollectionCoverImage from "@/components/CollectionCoverImage";
import EmptyState from "@/components/EmptyState";
import StatusMessage from "@/components/StatusMessage";
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

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

export default function CollectionsList() {
  const [collections, setCollections] = useState<CollectionListItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [requiresLogin, setRequiresLogin] = useState(false);

  async function loadCollections() {
    const user = await getSessionUser();

    if (!user) {
      setRequiresLogin(true);
      setCollections([]);
      setUserId(null);
      setErrorMessage("");
      return;
    }

    const nextCollections = await withTimeout(
      getCollections(user.id),
      6000,
      "컬렉션 조회 시간이 초과되었습니다.",
    );
    setCollections(nextCollections);
    setUserId(user.id);
    setRequiresLogin(false);
    setErrorMessage("");
  }

  useEffect(() => {
    let isMounted = true;

    async function loadInitialCollections() {
      try {
        const environment = getSupabaseEnvironmentStatus();

        if (!environment.configured) {
          setErrorMessage("컬렉션 기능 설정이 필요합니다.");
          return;
        }

        await loadCollections();
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setErrorMessage(
            "컬렉션을 불러오지 못했습니다. Supabase 설정을 확인해주세요.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadInitialCollections();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleCreateCollection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!userId || isCreating) {
      return;
    }

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setErrorMessage("컬렉션 이름을 입력해주세요.");
      return;
    }

    setIsCreating(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const { error } = await supabase.from("collections").insert({
        user_id: userId,
        name: trimmedName,
        description: trimmedDescription || null,
      });

      if (error) {
        throw error;
      }

      setName("");
      setDescription("");
      setSuccessMessage("새 컬렉션을 만들었습니다.");
      await loadCollections();
    } catch (error) {
      console.error(error);
      setErrorMessage("컬렉션을 만들지 못했습니다.");
    } finally {
      setIsCreating(false);
    }
  }

  if (isLoading) {
    return <StatusMessage>컬렉션을 불러오는 중...</StatusMessage>;
  }

  if (requiresLogin) {
    return (
      <EmptyState
        title="내 컬렉션을 보려면 로그인이 필요해요."
        description="로그인하고 장소를 개인 아카이브처럼 정리해보세요."
        actionHref="/login"
        actionLabel="로그인하기"
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr] lg:items-start">
      <form
        onSubmit={handleCreateCollection}
        className="rounded-3xl border border-[#E5E0D8] bg-[#FCFBF8] p-5 shadow-[0_14px_34px_rgba(77,87,72,0.06)] sm:p-6"
      >
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-normal text-[#3F3F3B]">
            새 컬렉션
          </h2>
          <p className="text-lg leading-8 text-[#6B6B68]">
            기억의 기준이 되는 이름으로 장소를 묶어보세요.
          </p>
        </div>

        <label className="mt-6 block">
          <span className="text-base font-semibold text-[#4D5748]">이름</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={60}
            className="mt-2 min-h-13 w-full rounded-2xl border border-[#E5E0D8] bg-[#F8F6F2] px-4 py-3 text-lg text-[#3F3F3B] outline-none transition focus:border-[#A8B2A1] focus:bg-[#FCFBF8]"
            placeholder="예: 조용한 주말의 장소"
          />
        </label>

        <label className="mt-4 block">
          <span className="text-base font-semibold text-[#4D5748]">설명</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={180}
            rows={4}
            className="mt-2 w-full resize-none rounded-2xl border border-[#E5E0D8] bg-[#F8F6F2] px-4 py-3 text-lg leading-8 text-[#3F3F3B] outline-none transition focus:border-[#A8B2A1] focus:bg-[#FCFBF8]"
            placeholder="이 컬렉션에 담고 싶은 분위기"
          />
        </label>

        <button
          type="submit"
          disabled={isCreating}
          className="mt-5 inline-flex min-h-13 w-full items-center justify-center rounded-full bg-[#A8B2A1] px-6 py-3 text-lg font-semibold text-[#2F362D] shadow-[0_10px_24px_rgba(77,87,72,0.14)] transition hover:bg-[#4D5748] hover:text-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isCreating ? "만드는 중..." : "컬렉션 만들기"}
        </button>

        {errorMessage && (
          <p className="mt-4 text-base font-medium leading-7 text-[#7A4B3A]">
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p className="mt-4 text-base font-medium leading-7 text-[#4D5748]">
            {successMessage}
          </p>
        )}
      </form>

      {collections.length === 0 ? (
        <EmptyState
          title="아직 컬렉션이 없어요."
          description="첫 컬렉션을 만들고 장소 상세에서 하나씩 담아보세요."
          actionHref="/explore"
          actionLabel="장소 둘러보기"
          className="h-full"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.id}`}
              className="group flex h-full flex-col rounded-3xl border border-[#E5E0D8] bg-[#FCFBF8] p-4 shadow-[0_14px_34px_rgba(77,87,72,0.06)] transition hover:-translate-y-0.5 hover:border-[#A8B2A1] hover:shadow-[0_18px_44px_rgba(77,87,72,0.1)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
            >
              <CollectionCoverImage
                imageUrl={collection.coverImageUrl}
                title={collection.name}
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

              <div className="mt-5 flex items-start justify-between gap-4">
                <span className="rounded-full bg-[#EAE3D8] px-3 py-1 text-base font-medium text-[#4D5748]">
                  {collection.placeCount}곳
                </span>
                <span className="text-base font-medium text-[#8A857D]">
                  {formatDate(collection.created_at)}
                </span>
              </div>
              <div className="mt-5 space-y-3">
                <h3 className="text-3xl font-semibold leading-tight tracking-normal text-[#3F3F3B]">
                  {collection.name}
                </h3>
                <p className="text-lg leading-8 text-[#6B6B68]">
                  {collection.description || "설명 없이 조용히 모아둔 컬렉션"}
                </p>
              </div>
              <span className="mt-auto pt-6 text-lg font-semibold text-[#4D5748]">
                열어보기
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
