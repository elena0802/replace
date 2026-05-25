import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "로그인 | Re:Place",
};

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="mb-8 space-y-3">
        <p className="text-lg font-medium text-[#4D5748]">Re:Place 계정</p>
        <h1 className="text-4xl font-semibold leading-tight tracking-normal text-[#3F3F3B]">
          내 장소 아카이브에 로그인하세요
        </h1>
        <p className="text-xl leading-9 text-[#6B6B68]">
          좋은 장소와 시간을 나만의 기록으로 안전하게 이어갑니다.
        </p>
      </div>

      <LoginForm />
    </div>
  );
}
