"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import CollectionCoverImage from "@/components/CollectionCoverImage";
import EmptyState from "@/components/EmptyState";
import PlaceCard from "@/components/PlaceCard";
import StatusMessage from "@/components/StatusMessage";
import { mapSupabaseError } from "@/lib/errors/userMessages";
import { withTimeout } from "@/lib/async/withTimeout";
import { getSessionUser } from "@/lib/auth/getSessionUser";
import {
  getCollectionDetail,
  type CollectionDetail,
} from "@/lib/collections/getCollectionDetail";
import { supabase } from "@/lib/supabase/client";

type CollectionDetailViewProps = {
  id: string;
};

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

export default function CollectionDetailView({ id }: CollectionDetailViewProps) {
  const router = useRouter();
  const [detail, setDetail] = useState<CollectionDetail | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [removingPlaceId, setRemovingPlaceId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeletingCollection, setIsDeletingCollection] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIsPublic, setEditIsPublic] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCollection() {
      try {
        const user = await getSessionUser();

        if (isMounted) {
          setCurrentUserId(user?.id ?? null);
        }

        const nextDetail = await withTimeout(
          getCollectionDetail(id, user?.id ?? null),
          6000,
          "컬렉션 상세 조회 시간이 초과되었습니다.",
        );

        if (!isMounted) {
          return;
        }

        if (!nextDetail) {
          setRequiresLogin(!user);
          setIsNotFound(Boolean(user));
          setDetail(null);
          return;
        }

        setDetail(nextDetail);
        setErrorMessage("");
        setActionError("");
        setSuccessMessage("");
        setRequiresLogin(false);
        setIsNotFound(false);
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setErrorMessage(mapSupabaseError(error, "collectionDetail"));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCollection();

    return () => {
      isMounted = false;
    };
  }, [id]);

  async function handleRemovePlace(collectionPlaceId: string) {
    if (removingPlaceId) {
      return;
    }

    setRemovingPlaceId(collectionPlaceId);
    setActionError("");
    setSuccessMessage("");

    try {
      const { error } = await supabase
        .from("collection_places")
        .delete()
        .eq("id", collectionPlaceId)
        .eq("collection_id", id);

      if (error) {
        throw error;
      }

      setDetail((currentDetail) => {
        if (!currentDetail) {
          return currentDetail;
        }

        return {
          collection: currentDetail.collection,
          places: currentDetail.places.filter(
            (item) => item.collectionPlaceId !== collectionPlaceId,
          ),
        };
      });
      setSuccessMessage("컬렉션에서 장소를 제거했습니다.");
    } catch (error) {
      console.error(error);
      setActionError("컬렉션에서 장소를 제거하지 못했습니다.");
    } finally {
      setRemovingPlaceId(null);
    }
  }

  function openEditModal() {
    if (!detail || detail.collection.user_id !== currentUserId) {
      return;
    }

    setEditName(detail.collection.name);
    setEditDescription(detail.collection.description ?? "");
    setEditIsPublic(detail.collection.is_public);
    setActionError("");
    setSuccessMessage("");
    setEditError("");
    setIsEditOpen(true);
  }

  function openDeleteModal() {
    if (!detail || detail.collection.user_id !== currentUserId) {
      return;
    }

    setActionError("");
    setSuccessMessage("");
    setIsDeleteOpen(true);
  }

  async function handleSaveCollection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!detail || !currentUserId || isSavingEdit) {
      return;
    }

    const trimmedName = editName.trim();
    const trimmedDescription = editDescription.trim();

    if (!trimmedName) {
      setEditError("컬렉션 이름을 입력해주세요.");
      return;
    }

    setIsSavingEdit(true);
    setActionError("");
    setSuccessMessage("");
    setEditError("");

    try {
      const { data, error } = await supabase
        .from("collections")
        .update({
          name: trimmedName,
          description: trimmedDescription || null,
          is_public: editIsPublic,
        })
        .eq("id", detail.collection.id)
        .eq("user_id", currentUserId)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      setDetail((currentDetail) => {
        if (!currentDetail) {
          return currentDetail;
        }

        return {
          collection: data,
          places: currentDetail.places,
        };
      });
      setSuccessMessage("컬렉션 정보를 저장했습니다.");
      setIsEditOpen(false);
    } catch (error) {
      console.error(error);
      setEditError("컬렉션 정보를 저장하지 못했습니다.");
    } finally {
      setIsSavingEdit(false);
    }
  }

  async function handleDeleteCollection() {
    if (!detail || !currentUserId || isDeletingCollection) {
      return;
    }

    setIsDeletingCollection(true);
    setActionError("");
    setSuccessMessage("");

    try {
      const { error } = await supabase
        .from("collections")
        .delete()
        .eq("id", detail.collection.id)
        .eq("user_id", currentUserId);

      if (error) {
        throw error;
      }

      router.push("/collections");
    } catch (error) {
      console.error(error);
      setActionError("컬렉션을 삭제하지 못했어요. 잠시 후 다시 시도해주세요.");
      setIsDeleteOpen(false);
    } finally {
      setIsDeletingCollection(false);
    }
  }

  if (isLoading) {
    return <StatusMessage>컬렉션을 불러오는 중...</StatusMessage>;
  }

  if (errorMessage) {
    return <StatusMessage tone="error">{errorMessage}</StatusMessage>;
  }

  if (requiresLogin) {
    return (
      <EmptyState
        title="컬렉션을 보려면 로그인이 필요해요."
        description="로그인하고 내가 모아둔 장소를 확인해보세요."
        actionHref="/login"
        actionLabel="로그인하기"
      />
    );
  }

  if (isNotFound || !detail) {
    return (
      <EmptyState
        title="이 컬렉션을 찾을 수 없어요."
        description="삭제되었거나 접근할 수 없는 컬렉션입니다."
        actionHref="/collections"
        actionLabel="컬렉션 목록"
      />
    );
  }

  const canManageCollection = detail.collection.user_id === currentUserId;
  const coverImageUrl = detail.places[0]?.place.image_url ?? null;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-[#E5E0D8] bg-[#FCFBF8] p-5 shadow-[0_14px_34px_rgba(77,87,72,0.06)] sm:p-7">
        <CollectionCoverImage
          imageUrl={coverImageUrl}
          title={detail.collection.name}
          className="shadow-[0_12px_30px_rgba(77,87,72,0.06)]"
          placeholderTitle={
            detail.places.length === 0
              ? "아직 담긴 장소가 없어요"
              : "커버 이미지가 없어요"
          }
          placeholderDescription={
            detail.places.length === 0
              ? "마음에 드는 장소를 컬렉션에 저장해보세요"
              : "이미지가 있는 장소를 담으면 커버가 채워집니다"
          }
        />

        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-lg font-medium text-[#4D5748]">
                {detail.places.length}개의 장소
              </p>
              <span className="rounded-full border border-[#E5E0D8] bg-[#FCFBF8] px-3 py-1 text-base font-medium text-[#6B6B68]">
                {detail.collection.is_public ? "공개" : "나만 보기"}
              </span>
            </div>
            <h1 className="text-4xl font-semibold leading-tight tracking-normal text-[#3F3F3B] sm:text-5xl">
              {detail.collection.name}
            </h1>
            <p className="text-xl leading-9 text-[#6B6B68]">
              {detail.collection.description ||
                "설명 없이 조용히 모아둔 개인 아카이브입니다."}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#EAE3D8] px-4 py-2 text-base font-medium text-[#4D5748]">
              생성일 {formatDate(detail.collection.created_at)}
            </span>
            {canManageCollection && (
              <>
                <button
                  type="button"
                  onClick={openEditModal}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#D7DED0] bg-[#FCFBF8] px-5 py-2.5 text-base font-semibold text-[#4D5748] transition hover:bg-[#EAE3D8]/45 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#4D5748]"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={openDeleteModal}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#D9C3B6] bg-[#FFF8F4] px-5 py-2.5 text-base font-semibold text-[#7A4B3A] transition hover:border-[#B89282] hover:bg-[#F6EAE3] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#7A4B3A]"
                >
                  컬렉션 삭제
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {successMessage && (
        <StatusMessage tone="success" className="text-left">
          {successMessage}
        </StatusMessage>
      )}

      {actionError && (
        <StatusMessage tone="error" className="text-left">
          {actionError}
        </StatusMessage>
      )}

      {detail.places.length === 0 ? (
        <EmptyState
          title="아직 이 컬렉션에 담긴 장소가 없어요."
          description="마음에 드는 장소를 컬렉션에 저장해보세요."
          actionHref="/explore"
          actionLabel="둘러보러 가기"
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {detail.places.map((item) => (
            <div
              key={item.collectionPlaceId}
              className="flex h-full flex-col gap-3"
            >
              <div className="relative flex-1">
                <PlaceCard place={item.place} variant="grid" />
                <span className="absolute right-4 top-4 rounded-full bg-[#FCFBF8]/95 px-3 py-1 text-base font-medium text-[#4D5748] shadow-[0_8px_18px_rgba(77,87,72,0.08)]">
                  추가일 {formatDate(item.addedAt)}
                </span>
              </div>
              {canManageCollection && (
                <button
                  type="button"
                  onClick={() => handleRemovePlace(item.collectionPlaceId)}
                  disabled={removingPlaceId === item.collectionPlaceId}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[#D9C3B6] bg-[#FFF8F4] px-5 py-2.5 text-base font-semibold text-[#7A4B3A] transition hover:border-[#B89282] hover:bg-[#F6EAE3] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#7A4B3A] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {removingPlaceId === item.collectionPlaceId
                    ? "제거하는 중..."
                    : "컬렉션에서 제거"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Link
        href="/collections"
        className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#D7DED0] bg-[#FCFBF8] px-5 py-3 text-lg font-semibold text-[#4D5748] transition hover:bg-[#EAE3D8]/45 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
      >
        컬렉션 목록으로
      </Link>

      {isEditOpen && (
        <div
          className="fixed inset-0 z-30 flex items-end bg-[#3F3F3B]/35 px-4 py-4 sm:items-center sm:justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="컬렉션 수정"
        >
          <form
            onSubmit={handleSaveCollection}
            className="w-full max-w-md rounded-3xl border border-[#E5E0D8] bg-[#FCFBF8] p-5 shadow-[0_24px_70px_rgba(63,63,59,0.24)] sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-[#3F3F3B]">
                  컬렉션 수정
                </h2>
                <p className="mt-2 text-lg leading-8 text-[#6B6B68]">
                  이름과 설명을 현재 기억에 맞게 다듬어보세요.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-[#E5E0D8] text-xl font-semibold text-[#6B6B68] transition hover:bg-[#F8F6F2] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#4D5748]"
                aria-label="닫기"
              >
                ×
              </button>
            </div>

            <label className="mt-6 block">
              <span className="text-base font-semibold text-[#4D5748]">
                이름
              </span>
              <input
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
                maxLength={60}
                className="mt-2 min-h-13 w-full rounded-2xl border border-[#E5E0D8] bg-[#F8F6F2] px-4 py-3 text-lg text-[#3F3F3B] outline-none transition focus:border-[#A8B2A1] focus:bg-[#FCFBF8]"
                placeholder="컬렉션 이름"
              />
            </label>

            <label className="mt-4 block">
              <span className="text-base font-semibold text-[#4D5748]">
                설명
              </span>
              <textarea
                value={editDescription}
                onChange={(event) => setEditDescription(event.target.value)}
                maxLength={180}
                rows={4}
                className="mt-2 w-full resize-none rounded-2xl border border-[#E5E0D8] bg-[#F8F6F2] px-4 py-3 text-lg leading-8 text-[#3F3F3B] outline-none transition focus:border-[#A8B2A1] focus:bg-[#FCFBF8]"
                placeholder="이 컬렉션에 담긴 장소의 분위기"
              />
            </label>

            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-[#E5E0D8] bg-[#F8F6F2] p-4 transition has-[:checked]:border-[#A8B2A1] has-[:checked]:bg-[#EAE3D8]/55">
              <input
                type="checkbox"
                checked={editIsPublic}
                onChange={(event) => setEditIsPublic(event.target.checked)}
                className="mt-1 size-5 accent-[#4D5748]"
              />
              <span>
                <span className="block text-base font-semibold text-[#4D5748]">
                  공개 컬렉션으로 설정
                </span>
                <span className="mt-1 block text-base leading-7 text-[#6B6B68]">
                  공개하면 다른 사람도 이 컬렉션을 볼 수 있어요.
                </span>
              </span>
            </label>

            {editError && (
              <p className="mt-4 text-base font-medium leading-7 text-[#7A4B3A]">
                {editError}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#D7DED0] px-5 py-3 text-lg font-semibold text-[#4D5748] transition hover:bg-[#EAE3D8]/45"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSavingEdit}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#A8B2A1] px-5 py-3 text-lg font-semibold text-[#2F362D] shadow-[0_10px_24px_rgba(77,87,72,0.14)] transition hover:bg-[#4D5748] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSavingEdit ? "저장하는 중..." : "저장"}
              </button>
            </div>
          </form>
        </div>
      )}

      {isDeleteOpen && (
        <div
          className="fixed inset-0 z-30 flex items-end bg-[#3F3F3B]/35 px-4 py-4 sm:items-center sm:justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="컬렉션 삭제"
        >
          <div className="w-full max-w-md rounded-3xl border border-[#E5C8BA] bg-[#FCFBF8] p-5 shadow-[0_24px_70px_rgba(63,63,59,0.24)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-[#3F3F3B]">
                  이 컬렉션을 삭제할까요?
                </h2>
                <p className="mt-3 text-lg leading-8 text-[#6B6B68]">
                  컬렉션만 삭제되고, 장소 기록은 그대로 남아 있어요.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                disabled={isDeletingCollection}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-[#E5E0D8] text-xl font-semibold text-[#6B6B68] transition hover:bg-[#F8F6F2] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#4D5748] disabled:cursor-not-allowed disabled:opacity-70"
                aria-label="닫기"
              >
                ×
              </button>
            </div>

            <div className="mt-6 rounded-2xl bg-[#FFF8F4] px-4 py-4 text-base leading-7 text-[#7A4B3A]">
              {detail.collection.name}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                disabled={isDeletingCollection}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#D7DED0] px-5 py-3 text-lg font-semibold text-[#4D5748] transition hover:bg-[#EAE3D8]/45 disabled:cursor-not-allowed disabled:opacity-70"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleDeleteCollection}
                disabled={isDeletingCollection}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#D9C3B6] bg-[#FFF8F4] px-5 py-3 text-lg font-semibold text-[#7A4B3A] transition hover:border-[#B89282] hover:bg-[#F6EAE3] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#7A4B3A] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isDeletingCollection ? "삭제하는 중..." : "삭제하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
