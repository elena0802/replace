"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

export default function AuthNav() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    async function loadSession() {
      try {
        const { data } = await supabase.auth.getSession();

        if (isMounted) {
          setUser(data.session?.user ?? null);
        }
      } catch (error) {
        console.error(error);
      }
    }

    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      unsubscribe = () => data.subscription.unsubscribe();
    } catch (error) {
      console.error(error);
    }

    loadSession();

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

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-[#E5E0D8] bg-[#FCFBF8] px-5 py-2 text-lg font-semibold text-[#4D5748] shadow-[0_8px_18px_rgba(77,87,72,0.08)] transition hover:border-[#A8B2A1] hover:bg-[#EAE3D8] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4D5748]"
      >
        로그인
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-[#E5E0D8] bg-[#FCFBF8] px-5 py-2 text-lg font-semibold text-[#4D5748] shadow-[0_8px_18px_rgba(77,87,72,0.08)] transition hover:border-[#A8B2A1] hover:bg-[#EAE3D8] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4D5748]"
    >
      로그아웃
    </button>
  );
}
