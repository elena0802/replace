"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { userMessages } from "@/lib/errors/userMessages";
import {
  getSupabaseEnvironmentStatus,
  supabase,
} from "@/lib/supabase/client";

type SavePlaceButtonProps = {
  placeId: string;
};

type Notice = {
  tone: "info" | "error";
  message: string;
};

export default function SavePlaceButton({ placeId }: SavePlaceButtonProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSavedState() {
      const environment = getSupabaseEnvironmentStatus();

      if (!environment.configured) {
        setIsLoading(false);
        setNotice({
          tone: "error",
          message: userMessages.saveUnavailable,
        });
        return;
      }

      setIsLoading(true);
      setNotice(null);

      try {
        const user = await getCurrentUser();

        if (!isMounted) {
          return;
        }

        setCurrentUser(user);

        if (!user) {
          setIsSaved(false);
          return;
        }

        const { data, error } = await supabase
          .from("saved_places")
          .select("id")
          .eq("user_id", user.id)
          .eq("place_id", placeId)
          .maybeSingle();

        if (!isMounted) {
          return;
        }

        if (error) {
          throw error;
        }

        setIsSaved(Boolean(data));
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setNotice({
            tone: "error",
            message: "저장 상태를 불러오지 못했습니다.",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSavedState();

    return () => {
      isMounted = false;
    };
  }, [placeId]);

  async function handleToggle() {
    if (isLoading || isMutating) {
      return;
    }

    const environment = getSupabaseEnvironmentStatus();

    if (!environment.configured) {
      setNotice({
        tone: "error",
        message: userMessages.saveUnavailable,
      });
      return;
    }

    if (!currentUser) {
      setNotice({
        tone: "info",
        message: "로그인이 필요합니다.",
      });
      return;
    }

    const nextSavedState = !isSaved;
    setIsSaved(nextSavedState);
    setIsMutating(true);
    setNotice(null);

    try {
      if (nextSavedState) {
        const { error } = await supabase.from("saved_places").insert({
          user_id: currentUser.id,
          place_id: placeId,
        });

        if (error && error.code !== "23505") {
          throw error;
        }

        setIsSaved(true);
        return;
      }

      const { error } = await supabase
        .from("saved_places")
        .delete()
        .eq("user_id", currentUser.id)
        .eq("place_id", placeId);

      if (error) {
        throw error;
      }

      setIsSaved(false);
    } catch (error) {
      console.error(error);
      setIsSaved(!nextSavedState);
      setNotice({
        tone: "error",
        message: nextSavedState
          ? "장소를 저장하지 못했습니다."
          : "저장을 해제하지 못했습니다.",
      });
    } finally {
      setIsMutating(false);
    }
  }

  const disabled = isLoading || isMutating;

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        aria-pressed={isSaved}
        disabled={disabled}
        onClick={handleToggle}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#D7DED0] bg-[#FCFBF8] px-5 py-3 text-lg font-semibold text-[#4D5748] transition hover:bg-[#EAE3D8]/45 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span aria-hidden="true" className="text-xl leading-none">
          {isSaved ? "♥" : "♡"}
        </span>
        {isSaved ? "저장됨" : "저장하기"}
      </button>

      {notice && (
        <p
          aria-live="polite"
          className={
            notice.tone === "error"
              ? "max-w-64 text-sm font-medium leading-6 text-[#7A4B3A]"
              : "max-w-64 text-sm font-medium leading-6 text-[#4D5748]"
          }
        >
          {notice.message}
          {notice.message === "로그인이 필요합니다." && (
            <>
              {" "}
              <Link className="underline underline-offset-4" href="/login">
                로그인
              </Link>
            </>
          )}
        </p>
      )}
    </div>
  );
}
