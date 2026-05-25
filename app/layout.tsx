import type { Metadata } from "next";
import Link from "next/link";
import AuthNav from "@/components/AuthNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Re:Place",
  description: "좋은 장소와 시간을 기록하고 공유하는 라이프스타일 아카이브",
};

const navigation = [
  { name: "홈", href: "/" },
  { name: "기록하기", href: "/places/new" },
  { name: "내 장소", href: "/my-places" },
  { name: "둘러보기", href: "/explore" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col bg-[#F8F6F2] text-[#3F3F3B] antialiased">
        <header className="sticky top-0 z-20 border-b border-[#EFEAE2] bg-[#F8F6F2]/95 backdrop-blur">
          <nav className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:px-5 sm:py-4 lg:px-8">
            <div className="flex min-h-12 items-center justify-between gap-3">
              <Link
                href="/"
                className="shrink-0 text-2xl font-semibold tracking-normal text-[#4D5748]"
              >
                Re:Place
              </Link>
              <AuthNav />
            </div>
            <div className="-mx-1 overflow-x-auto pb-1">
              <div className="flex min-w-max gap-2 px-1 text-lg font-medium text-[#6B6B68]">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex min-h-11 items-center rounded-full px-4 py-2 transition hover:bg-[#EAE3D8] hover:text-[#4D5748] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4D5748]"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[#EFEAE2] bg-[#FCFBF8]">
          <div className="mx-auto max-w-6xl px-5 py-7 text-base text-[#6B6B68] lg:px-8">
            Re:Place - 좋은 장소와 시간을 기록하는 라이프스타일 아카이브
          </div>
        </footer>
      </body>
    </html>
  );
}
