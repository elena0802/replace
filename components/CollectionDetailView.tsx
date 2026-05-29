"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import EmptyState from "@/components/EmptyState";
import PlaceCard from "@/components/PlaceCard";
import StatusMessage from "@/components/StatusMessage";
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
  const [detail, setDetail] = useState<CollectionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [removingPlaceId, setRemovingPlaceId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCollection() {
      try {
        const user = await getSessionUser();

        if (!user) {
          if (isMounted) {
            setRequiresLogin(true);
            setDetail(null);
          }
          return;
        }

        const nextDetail = await withTimeout(
          getCollectionDetail(id, user.id),
          6000,
          "컬렉션 상세 조회 시간이 초과되었습니다.",
        );

        if (!isMounted) {
          return;
        }

        if (!nextDetail) {
          setIsNotFound(true);
          setDetail(null);
          return;
        }

        setDetail(nextDetail);
        setErrorMessage("");
        setActionError("");
        setRequiresLogin(false);
        setIsNotFound(false);
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
    } catch (error) {
      console.error(error);
      setActionError("컬렉션에서 장소를 제거하지 못했습니다.");
    } finally {
      setRemovingPlaceId(null);
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

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-[#E5E0D8] bg-[#FCFBF8] p-5 shadow-[0_14px_34px_rgba(77,87,72,0.06)] sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-lg font-medium text-[#4D5748]">
              {detail.places.length}개의 장소
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-normal text-[#3F3F3B] sm:text-5xl">
              {detail.collection.name}
            </h1>
            <p className="text-xl leading-9 text-[#6B6B68]">
              {detail.collection.description ||
                "설명 없이 조용히 모아둔 개인 아카이브입니다."}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-[#EAE3D8] px-4 py-2 text-base font-medium text-[#4D5748]">
            생성일 {formatDate(detail.collection.created_at)}
          </span>
        </div>
      </section>

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
                <PlaceCard place={item.place} />
                <span className="absolute right-4 top-4 rounded-full bg-[#FCFBF8]/95 px-3 py-1 text-base font-medium text-[#4D5748] shadow-[0_8px_18px_rgba(77,87,72,0.08)]">
                  추가일 {formatDate(item.addedAt)}
                </span>
              </div>
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
    </div>
  );
}
