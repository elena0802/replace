"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/lib/auth/useAuthUser";
import { supabase } from "@/lib/supabase/client";

const authButtonClass =
  "inline-flex min-h-9 shrink-0 items-center justify-center rounded-full border border-default/30 bg-transparent px-3.5 py-1.5 text-base font-medium text-link transition hover:bg-[color:var(--color-accent-subtle)] hover:opacity-85 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-hover";

export default function AuthNav() {
  const router = useRouter();
  const user = useAuthUser();

  async function handleLogout() {
    await supabase.auth.signOut();
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
