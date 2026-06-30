"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const mobileNavigation = [
  { name: "HOME", href: "/" },
  { name: "기록하기", href: "/places/new" },
  { name: "둘러보기", href: "/explore" },
  { name: "저장한 장소", href: "/saved" },
  { name: "컬렉션", href: "/collections" },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MobileHeaderNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="모바일"
      className="grid grid-cols-3 gap-x-1 gap-y-0.5 md:hidden"
    >
      {mobileNavigation.map((item) => {
        const isActive = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex h-8 min-h-8 items-center justify-center px-1 text-center text-[12px] leading-tight transition focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-hover ${
              isActive
                ? "border-b border-ink/40 font-medium text-ink"
                : "text-meta hover:text-stone"
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
