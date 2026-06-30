"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import KakaoIcon from "@/components/icons/KakaoIcon";
import { getSafeAuthRedirectPath } from "@/lib/auth/redirect";
import { supabase } from "@/lib/supabase/client";

const fieldClass =
  "min-h-[52px] w-full rounded-2xl border border-default bg-overlay px-4 text-base font-medium text-ink outline-none transition placeholder:text-meta focus:border-brand-muted focus:ring-3 focus:ring-[color:var(--focus-ring-input)]";

type LoginFormProps = {
  initialErrorMessage?: string;
};

export default function LoginForm({ initialErrorMessage = "" }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(initialErrorMessage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isKakaoSubmitting, setIsKakaoSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isAuthPending = isSubmitting || isKakaoSubmitting;

  function getLoginRedirectPath() {
    const params = new URLSearchParams(window.location.search);
    return getSafeAuthRedirectPath(params.get("next"));
  }

  async function handleAuth(action: "login" | "signup") {
    setMessage("");
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const credentials = {
        email: email.trim(),
        password,
      };

      const { data, error } =
        action === "login"
          ? await supabase.auth.signInWithPassword(credentials)
          : await supabase.auth.signUp(credentials);

      if (error) {
        throw error;
      }

      if (action === "signup" && !data.session) {
        setMessage("회원가입 요청이 완료되었습니다. 이메일 확인 후 로그인해주세요.");
        return;
      }

      router.push(getLoginRedirectPath());
    } catch (error) {
      console.error(error);
      setErrorMessage(
        action === "login"
          ? "로그인하지 못했습니다. 이메일과 비밀번호를 확인해주세요."
          : "회원가입하지 못했습니다. 이메일 형식과 비밀번호를 확인해주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleKakaoLogin() {
    setMessage("");
    setErrorMessage("");
    setIsKakaoSubmitting(true);

    try {
      const callbackUrl = new URL("/auth/callback", window.location.origin);
      callbackUrl.searchParams.set("next", getLoginRedirectPath());

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo: callbackUrl.toString(),
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("카카오 로그인을 시작하지 못했습니다. 잠시 후 다시 시도해주세요.");
      setIsKakaoSubmitting(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleAuth("login");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-full rounded-xl border border-default/30 bg-overlay p-4 shadow-floating backdrop-blur-md sm:p-5"
    >
      <button
        type="button"
        disabled={isAuthPending}
        onClick={handleKakaoLogin}
        className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#FEE500] px-5 py-3.5 text-base font-bold text-ink shadow-sm transition hover:bg-[#F8D900] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover disabled:cursor-not-allowed disabled:opacity-70 sm:text-lg"
      >
        <KakaoIcon />
        {isKakaoSubmitting ? "카카오로 이동 중..." : "카카오로 시작하기"}
      </button>

      <div className="my-3 flex items-center gap-3 text-sm font-medium text-meta sm:my-4 sm:text-base">
        <span className="h-px flex-1 bg-[color:var(--color-border-default)]" />
        또는 이메일로 계속하기
        <span className="h-px flex-1 bg-[color:var(--color-border-default)]" />
      </div>

      {(message || errorMessage) && (
        <div
          className={`mb-4 rounded-2xl border px-4 py-3 text-sm font-semibold leading-6 ${
            message
              ? "border-brand-muted bg-[color:var(--color-success-surface)] text-link"
              : "border-danger-border bg-danger-surface text-danger"
          }`}
          role={message ? "status" : "alert"}
        >
          {message || errorMessage}
        </div>
      )}

      <label className="block space-y-1.5 text-[15px] font-semibold text-ink">
        이메일
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          placeholder="you@example.com"
          className={fieldClass}
        />
      </label>

      <div className="mt-3">
        <label className="block space-y-1.5 text-[15px] font-semibold text-ink">
          비밀번호
          <span className="relative block">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="비밀번호를 입력하세요"
              className={`${fieldClass} pr-14`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-meta transition hover:bg-[color:var(--color-accent)]/60 hover:text-link focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-hover"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {showPassword ? (
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="m3 3 18 18" />
                  <path d="M10.6 10.6a3 3 0 0 0 4 4" />
                  <path d="M9.9 4.3A10.5 10.5 0 0 1 12 4c6.5 0 10 8 10 8a18.6 18.6 0 0 1-2.5 3.7" />
                  <path d="M6.6 6.6C3.5 8.7 2 12 2 12s3.5 8 10 8a10.7 10.7 0 0 0 4.4-.9" />
                </svg>
              )}
            </button>
          </span>
        </label>
        <div className="mt-1.5 flex justify-end">
          <button
            type="button"
            onClick={() => setMessage("비밀번호 재설정은 이메일 문의로 도와드릴게요.")}
            className="text-sm font-medium text-stone transition hover:text-link focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-hover"
          >
            비밀번호 찾기
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <button
          type="submit"
          disabled={isAuthPending}
          className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-brand px-7 py-3.5 text-base font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover disabled:cursor-not-allowed disabled:opacity-70 sm:text-lg"
        >
          {isSubmitting ? "처리 중..." : "로그인"}
        </button>
        <button
          type="button"
          disabled={isAuthPending}
          onClick={() => handleAuth("signup")}
          className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl border border-default bg-surface px-7 py-3.5 text-base font-semibold text-link transition hover:border-brand-muted hover:bg-subtle focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover disabled:cursor-not-allowed disabled:opacity-70 sm:text-lg"
        >
          회원가입
        </button>
      </div>

      <div className="mt-4 border-t border-border-muted pt-3 text-center text-xs leading-5 text-meta sm:text-sm">
        <p>로그인/회원 관련 도움이 필요하신가요?</p>
        <Link
          href="/login#help"
          className="mt-1 inline-flex font-semibold text-stone underline underline-offset-4 transition hover:text-link focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-hover"
        >
          자주 묻는 질문 바로가기 &gt;
        </Link>
      </div>
    </form>
  );
}
