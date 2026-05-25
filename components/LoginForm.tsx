"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const fieldClass =
  "min-h-14 w-full rounded-2xl border border-[#E5E0D8] bg-white px-4 text-xl font-medium text-[#3F3F3B] outline-none transition placeholder:text-[#6B6B68]/60 focus:border-[#A8B2A1] focus:ring-3 focus:ring-[#A8B2A1]/20";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleAuth("login");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-7 rounded-3xl border border-[#E5E0D8] bg-[#FCFBF8] p-5 shadow-[0_18px_44px_rgba(77,87,72,0.07)] sm:p-7"
    >
      {(message || errorMessage) && (
        <div
          className={`rounded-2xl border px-5 py-4 text-lg font-semibold leading-8 ${
            message
              ? "border-[#A8B2A1] bg-[#A8B2A1]/20 text-[#4D5748]"
              : "border-[#E5C8BA] bg-[#FFF8F4] text-[#7A4B3A]"
          }`}
          role={message ? "status" : "alert"}
        >
          {message || errorMessage}
        </div>
      )}

      <label className="block space-y-2 text-lg font-semibold text-[#3F3F3B]">
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

      <label className="block space-y-2 text-lg font-semibold text-[#3F3F3B]">
        비밀번호
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          placeholder="비밀번호"
          className={fieldClass}
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-14 flex-1 items-center justify-center rounded-full bg-[#A8B2A1] px-7 py-4 text-xl font-semibold text-[#2F362D] shadow-[0_10px_24px_rgba(77,87,72,0.14)] transition hover:bg-[#4D5748] hover:text-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "처리 중..." : "로그인"}
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleAuth("signup")}
          className="inline-flex min-h-14 flex-1 items-center justify-center rounded-full border border-[#E5E0D8] bg-white px-7 py-4 text-xl font-semibold text-[#4D5748] transition hover:border-[#A8B2A1] hover:bg-[#EAE3D8] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748] disabled:cursor-not-allowed disabled:opacity-70"
        >
          회원가입
        </button>
      </div>
    </form>
  );
}
