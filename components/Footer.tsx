import Link from "next/link";

const footerNavigation = [
  { name: "홈", href: "/" },
  { name: "둘러보기", href: "/explore" },
  { name: "기록하기", href: "/places/new" },
  { name: "컬렉션", href: "/collections" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border-muted bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-5 py-12 text-center sm:py-16 lg:px-8">
        <p className="text-xl font-semibold tracking-[0.12em] text-ink sm:text-2xl">
          RE:PLACE
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone sm:text-lg">
          좋았던 장소를 오래 간직하는
          <br />
          Place Archive
        </p>
        <nav
          aria-label="푸터"
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-base font-medium text-stone"
        >
          {footerNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-ink focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-hover"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <p className="mt-10 text-sm text-meta">© Re:Place</p>
      </div>
    </footer>
  );
}
