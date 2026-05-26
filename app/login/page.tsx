import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "로그인 | Re:Place",
};

export default function LoginPage() {
  return (
    <>
      <style>
        {`
          body:has([data-replace-auth-page]) > header,
          body:has([data-replace-auth-page]) > footer {
            display: none;
          }

          body:has([data-replace-auth-page]) {
            overflow-x: hidden;
          }
        `}
      </style>
      <div data-replace-auth-page className="min-h-screen overflow-x-hidden bg-[#F7F3EC]">
        <div
          className="relative flex min-h-screen items-center justify-center overflow-x-hidden px-5 py-5 sm:px-6 sm:py-6 lg:px-8"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(247, 243, 236, 0.86) 0%, rgba(247, 243, 236, 0.72) 48%, rgba(247, 243, 236, 0.9) 100%), url('https://images.unsplash.com/photo-1643148636637-58b3eb95cdad?auto=format&fit=crop&w=1800&q=85')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(252,251,248,0.86),rgba(252,251,248,0))]" />

          <div className="relative mx-auto flex w-full max-w-[350px] min-w-0 flex-col items-stretch sm:max-w-2xl sm:items-center">
            <header className="w-full text-center">
              <Link
                href="/"
                className="text-[2.25rem] font-semibold leading-none tracking-normal text-[#2F3B31] transition hover:opacity-80 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748] sm:text-[2.5rem]"
              >
                Re:Place
              </Link>
              <h1 className="mt-5 text-[1.8rem] font-semibold leading-tight tracking-normal text-[#30322E] sm:mt-6 sm:text-[2.1rem]">
                <span className="block sm:inline">좋은 장소와 시간을</span>{" "}
                <span className="block sm:inline">기록하세요</span>
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-[#6F6A62]">
                <span className="block sm:inline">기록은 쌓이고,</span>{" "}
                <span className="block sm:inline">좋아했던 순간은 오래 남습니다.</span>
              </p>
            </header>

            <div className="mt-7 w-full min-w-0 sm:mt-8 sm:max-w-[560px]">
              <LoginForm />
            </div>

            <footer className="w-full pt-5 text-center text-xs leading-6 text-[#7D786F] sm:text-sm">
              <p>Re:Place - 좋은 장소와 시간을 기록하는 라이프스타일 아카이브</p>
              <div className="mt-2 flex items-center justify-center gap-4">
                <Link
                  href="/login#terms"
                  className="transition hover:text-[#4D5748] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#4D5748]"
                >
                  이용약관
                </Link>
                <Link
                  href="/login#privacy"
                  className="transition hover:text-[#4D5748] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#4D5748]"
                >
                  개인정보처리방침
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
