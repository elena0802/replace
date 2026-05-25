import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
};

export default function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-3xl border border-[#E5E0D8] bg-[#FCFBF8] px-5 py-12 text-center shadow-[0_14px_34px_rgba(77,87,72,0.06)] sm:px-8 ${className}`}
    >
      <h2 className="text-3xl font-semibold leading-tight tracking-normal text-[#3F3F3B] sm:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-xl leading-9 text-[#6B6B68]">
        {description}
      </p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-8 inline-flex min-h-14 items-center justify-center rounded-full bg-[#A8B2A1] px-7 py-4 text-xl font-semibold text-[#2F362D] shadow-[0_10px_24px_rgba(77,87,72,0.14)] transition hover:bg-[#4D5748] hover:text-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
