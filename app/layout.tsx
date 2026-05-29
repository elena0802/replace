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
  { name: "둘러보기", href: "/explore" },
  { name: "내 장소", href: "/my-places" },
  { name: "요금제", href: "/pricing" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col bg-[#F7F5EF] text-[#3F3F3B] antialiased">
        <header className="sticky top-0 z-20 bg-[#F7F5EF]/95 backdrop-blur-[2px]">
          <nav className="mx-auto flex h-[58px] w-full max-w-6xl items-center justify-between gap-4 px-5 sm:h-[60px] lg:px-8">
            <div className="flex min-w-0 items-center gap-6">
              <Link
                href="/"
                className="shrink-0 text-[1.35rem] font-semibold tracking-normal text-[#3F4A3D] transition hover:opacity-75 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
              >
                Re:Place
              </Link>

              <div className="hidden items-center gap-0.5 text-[0.98rem] font-medium text-[#6F6F68] md:flex">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex min-h-9 items-center rounded-full px-3 py-1.5 transition hover:text-[#3F4A3D] hover:opacity-80 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#4D5748]"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <details className="relative md:hidden">
                <summary className="inline-flex min-h-9 cursor-pointer list-none items-center rounded-full border border-black/[0.08] bg-transparent px-3.5 py-1.5 text-base font-medium text-[#4D5748] transition hover:bg-[#EAE3D8]/45 hover:opacity-85 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#4D5748] [&::-webkit-details-marker]:hidden">
                  메뉴
                </summary>
                <div className="absolute right-0 top-full mt-3 w-44 rounded-3xl border border-black/[0.08] bg-[#FCFBF8] p-2 shadow-[0_14px_34px_rgba(63,74,61,0.1)]">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex min-h-11 items-center rounded-2xl px-4 text-base font-medium text-[#6F6F68] transition hover:bg-[#F8F6F2] hover:text-[#3F4A3D] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4D5748]"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </details>

              <AuthNav />
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
