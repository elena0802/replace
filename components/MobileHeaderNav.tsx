"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useAuthUser } from "@/lib/auth/useAuthUser";

const loggedOutMobileNavigation = [
  { name: "HOME", href: "/" },
  { name: "기록하기", href: "/places/new" },
  { name: "둘러보기", href: "/explore" },
  { name: "저장한 장소", href: "/saved" },
  { name: "컬렉션", href: "/collections" },
] as const;

const myPlacesNavItem = { name: "내 장소", href: "/my-places" } as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MobileHeaderNav() {
  const pathname = usePathname();
  const user = useAuthUser();

  const mobileNavigation = useMemo(
    () =>
      user
        ? [...loggedOutMobileNavigation, myPlacesNavItem]
        : [...loggedOutMobileNavigation],
    [user],
  );

  return (
    <nav
      aria-label="모바일"
      className="grid grid-cols-3 gap-x-1 gap-y-0 md:hidden"
    >
      {mobileNavigation.map((item) => {
        const isActive = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`relative inline-flex h-8 min-h-8 items-center justify-center px-1 text-center text-[12px] leading-tight transition focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-hover ${
              isActive
                ? "font-medium text-ink after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-[65%] after:-translate-x-1/2 after:bg-ink/40 after:content-['']"
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
