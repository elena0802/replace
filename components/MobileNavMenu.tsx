"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

type NavItem = {
  name: string;
  href: string;
};

type MobileNavMenuProps = {
  items: readonly NavItem[];
};

const menuButtonBaseClassName =
  "inline-flex min-h-9 cursor-pointer items-center rounded-full border px-3.5 py-1.5 text-base font-medium text-link transition-colors duration-200 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-hover";

const menuButtonClosedClassName =
  "border-default/30 bg-transparent hover:bg-[color:var(--color-accent-subtle)]/60";

const menuButtonOpenClassName =
  "border-default/45 bg-subtle";

const menuLinkClassName =
  "flex min-h-11 items-center rounded-md px-4 text-base font-medium text-stone transition hover:bg-subtle hover:text-ink focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-hover";

export default function MobileNavMenu({ items }: MobileNavMenuProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [previousPathname, setPreviousPathname] = useState(pathname);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const closeFocusRef = useRef(false);
  const panelId = useId();

  if (pathname !== previousPathname) {
    setPreviousPathname(pathname);
    if (isOpen) {
      setIsOpen(false);
    }
  }

  const closeMenu = useCallback((returnFocus = false) => {
    closeFocusRef.current = returnFocus;
    setIsOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsOpen((current) => !current);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (closeFocusRef.current) {
        menuButtonRef.current?.focus();
        closeFocusRef.current = false;
      }

      return;
    }

    firstLinkRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      event.preventDefault();
      closeMenu(true);
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (
        panelRef.current?.contains(target) ||
        menuButtonRef.current?.contains(target)
      ) {
        return;
      }

      closeMenu(true);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, closeMenu]);

  return (
    <>
      {isOpen ? (
        <div
          className="fixed inset-0 z-40 bg-stone-950/5 md:hidden"
          aria-hidden="true"
        />
      ) : null}

      <div className={`relative md:hidden ${isOpen ? "z-50" : ""}`}>
        <button
          ref={menuButtonRef}
          type="button"
          className={`${menuButtonBaseClassName} ${isOpen ? menuButtonOpenClassName : menuButtonClosedClassName}`}
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-haspopup="menu"
          onClick={toggleMenu}
        >
          메뉴
        </button>

        {isOpen ? (
          <nav
            ref={panelRef}
            id={panelId}
            aria-label="모바일 메뉴"
            className="absolute right-0 top-full z-50 mt-3 w-44 rounded-xl border border-default/30 bg-surface p-2 shadow-card"
          >
            {items.map((item, index) => (
              <Link
                key={item.href}
                ref={index === 0 ? firstLinkRef : undefined}
                href={item.href}
                className={menuLinkClassName}
                onClick={() => closeMenu()}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
    </>
  );
}
