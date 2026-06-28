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
      className={`rounded-xl border border-default bg-surface px-5 py-12 text-center shadow-card sm:px-8 ${className}`}
    >
      <h2 className="text-3xl font-semibold leading-tight tracking-normal text-ink sm:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-xl leading-9 text-stone">
        {description}
      </p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-8 inline-flex min-h-14 items-center justify-center rounded-full bg-brand-muted px-7 py-4 text-xl font-semibold text-action-secondary-foreground shadow-sm transition hover:bg-brand-hover hover:text-inverse focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
