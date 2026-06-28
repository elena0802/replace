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
  { name: "저장한 장소", href: "/saved" },
  { name: "컬렉션", href: "/collections" },
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
      <body className="flex min-h-screen flex-col bg-page text-foreground antialiased">
        <header className="sticky top-0 z-20 bg-page/95 backdrop-blur-[2px]">
          <nav className="mx-auto flex h-[58px] w-full max-w-6xl items-center justify-between gap-4 px-5 sm:h-[60px] lg:px-8">
            <div className="flex min-w-0 items-center gap-6">
              <Link
                href="/"
                className="shrink-0 text-[1.35rem] font-semibold tracking-normal text-ink transition hover:opacity-75 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover"
              >
                Re:Place
              </Link>

              <div className="hidden items-center gap-0.5 text-[0.98rem] font-medium text-stone md:flex">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex min-h-9 items-center rounded-full px-3 py-1.5 transition hover:text-ink hover:opacity-80 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-hover"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <details className="relative md:hidden">
                <summary className="inline-flex min-h-9 cursor-pointer list-none items-center rounded-full border border-default/30 bg-transparent px-3.5 py-1.5 text-base font-medium text-link transition hover:bg-[color:var(--color-accent-subtle)] hover:opacity-85 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-hover [&::-webkit-details-marker]:hidden">
                  메뉴
                </summary>
                <div className="absolute right-0 top-full mt-3 w-44 rounded-xl border border-default/30 bg-surface p-2 shadow-floating">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex min-h-11 items-center rounded-md px-4 text-base font-medium text-stone transition hover:bg-subtle hover:text-ink focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-hover"
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
        <footer className="border-t border-border-muted bg-surface">
          <div className="mx-auto max-w-6xl px-5 py-7 text-base text-stone lg:px-8">
            Re:Place - 좋은 장소와 시간을 기록하는 라이프스타일 아카이브
          </div>
        </footer>
      </body>
    </html>
  );
}
