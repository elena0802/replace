import type { Metadata } from "next";
import Link from "next/link";
import AuthNav from "@/components/AuthNav";
import Footer from "@/components/Footer";
import MobileHeaderNav from "@/components/MobileHeaderNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Re:Place",
  description: "좋은 장소와 시간을 기록하고 공유하는 라이프스타일 아카이브",
};

const navigation = [
  { name: "홈", href: "/" },
  { name: "기록하기", href: "/places/new" },
  { name: "둘러보기", href: "/explore" },
  { name: "저장한 장소", href: "/saved" },
  { name: "컬렉션", href: "/collections" },
  { name: "내 장소", href: "/my-places" },
  // TODO(Navigation RFC): 요금제 may be hidden or moved after nav IA is finalized.
  { name: "요금제", href: "/pricing" },
];

const navLinkClassName =
  "inline-flex min-h-9 items-center rounded-full px-3 py-1.5 text-[0.98rem] font-medium text-stone transition hover:text-ink hover:opacity-80 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-hover";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col bg-page text-foreground antialiased">
        <header className="sticky top-0 z-20 border-b border-default/40 bg-page md:border-b-0 md:bg-page/95 md:backdrop-blur-[2px]">
          <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">
            <nav
              aria-label="주요"
              className="flex h-[58px] items-center justify-between gap-4 sm:h-[60px]"
            >
              <div className="flex min-w-0 items-center gap-6">
                <Link
                  href="/"
                  className="shrink-0 text-[1.35rem] font-semibold tracking-normal text-ink transition hover:opacity-75 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover"
                >
                  Re:Place
                </Link>

                <div className="hidden items-center gap-0.5 md:flex">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={navLinkClassName}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              <AuthNav />
            </nav>

            <div className="pb-1.5 md:hidden">
              <MobileHeaderNav />
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
