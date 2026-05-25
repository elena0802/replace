"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { supabase } from "@/lib/supabase/client";

export default function AuthNav() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    async function loadUser() {
      const currentUser = await getCurrentUser();

      if (isMounted) {
        setUser(currentUser);
        setIsLoading(false);
      }
    }

    loadUser();

    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      });
      unsubscribe = () => data.subscription.unsubscribe();
    } catch (error) {
      console.error(error);
    }

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  }

  if (isLoading) {
    return (
      <span className="rounded-full px-4 py-2 text-[#6B6B68]">확인 중</span>
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-[#FCFBF8] px-4 py-2 text-[#4D5748] shadow-[0_8px_18px_rgba(77,87,72,0.06)] transition hover:bg-[#EAE3D8] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4D5748]"
      >
        로그인
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-full bg-[#FCFBF8] px-4 py-2 text-[#4D5748] shadow-[0_8px_18px_rgba(77,87,72,0.06)] transition hover:bg-[#EAE3D8] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4D5748]"
    >
      로그아웃
    </button>
  );
}
