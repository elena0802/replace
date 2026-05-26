"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const fieldClass =
  "min-h-[52px] w-full rounded-2xl border border-[#DED8CE] bg-[#FCFBF8]/90 px-4 text-base font-medium text-[#3F3F3B] outline-none transition placeholder:text-[#9A948B] focus:border-[#A8B2A1] focus:ring-3 focus:ring-[#A8B2A1]/20";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

      router.push("/my-places");
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
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo: `${window.location.origin}/my-places`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("카카오 로그인을 시작하지 못했습니다. 잠시 후 다시 시도해주세요.");
      setIsSubmitting(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleAuth("login");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-full rounded-[28px] border border-black/[0.06] bg-[#FCFBF8]/90 p-4 shadow-[0_20px_58px_rgba(77,87,72,0.1)] backdrop-blur-md sm:p-5"
    >
      <button
        type="button"
        disabled={isSubmitting}
        onClick={handleKakaoLogin}
        className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#FEE500] px-5 py-3.5 text-base font-bold text-[#2A221E] shadow-[0_8px_20px_rgba(77,65,18,0.08)] transition hover:bg-[#F8D900] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748] disabled:cursor-not-allowed disabled:opacity-70 sm:text-lg"
      >
        <span className="relative flex h-6 w-7 items-center justify-center" aria-hidden="true">
          <span className="h-4 w-5 rounded-full bg-[#2A221E]" />
          <span className="absolute bottom-0 left-1 h-2 w-2 rotate-45 bg-[#2A221E]" />
        </span>
        카카오로 시작하기
      </button>

      <div className="my-3 flex items-center gap-3 text-sm font-medium text-[#7D786F] sm:my-4 sm:text-base">
        <span className="h-px flex-1 bg-[#E5E0D8]" />
        또는 이메일로 계속하기
        <span className="h-px flex-1 bg-[#E5E0D8]" />
      </div>

      {(message || errorMessage) && (
        <div
          className={`mb-4 rounded-2xl border px-4 py-3 text-sm font-semibold leading-6 ${
            message
              ? "border-[#A8B2A1] bg-[#A8B2A1]/20 text-[#4D5748]"
              : "border-[#E5C8BA] bg-[#FFF8F4] text-[#7A4B3A]"
          }`}
          role={message ? "status" : "alert"}
        >
          {message || errorMessage}
        </div>
      )}

      <label className="block space-y-1.5 text-[15px] font-semibold text-[#3F3F3B]">
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
        <label className="block space-y-1.5 text-[15px] font-semibold text-[#3F3F3B]">
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
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-[#8A857D] transition hover:bg-[#EAE3D8]/60 hover:text-[#4D5748] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4D5748]"
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
            className="text-sm font-medium text-[#6F6A62] transition hover:text-[#4D5748] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#4D5748]"
          >
            비밀번호 찾기
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#87977F] px-7 py-3.5 text-base font-semibold text-[#FCFBF8] shadow-[0_8px_20px_rgba(77,87,72,0.12)] transition hover:bg-[#4D5748] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748] disabled:cursor-not-allowed disabled:opacity-70 sm:text-lg"
        >
          {isSubmitting ? "처리 중..." : "로그인"}
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleAuth("signup")}
          className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl border border-[#D8D1C6] bg-[#FCFBF8] px-7 py-3.5 text-base font-semibold text-[#4D5748] transition hover:border-[#A8B2A1] hover:bg-[#F3EFE8] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748] disabled:cursor-not-allowed disabled:opacity-70 sm:text-lg"
        >
          회원가입
        </button>
      </div>

      <div className="mt-4 border-t border-[#EFEAE2] pt-3 text-center text-xs leading-5 text-[#7D786F] sm:text-sm">
        <p>로그인/회원 관련 도움이 필요하신가요?</p>
        <Link
          href="/login#help"
          className="mt-1 inline-flex font-semibold text-[#6F6A62] underline underline-offset-4 transition hover:text-[#4D5748] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#4D5748]"
        >
          자주 묻는 질문 바로가기 &gt;
        </Link>
      </div>
    </form>
  );
}
