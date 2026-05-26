"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

const authButtonClass =
  "inline-flex min-h-9 shrink-0 items-center justify-center rounded-full border border-black/[0.1] bg-transparent px-3.5 py-1.5 text-base font-medium text-[#4D5748] transition hover:bg-[#EAE3D8]/45 hover:opacity-85 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#4D5748]";

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
        className={authButtonClass}
      >
        로그인
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={authButtonClass}
    >
      로그아웃
    </button>
  );
}
