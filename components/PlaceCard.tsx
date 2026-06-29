import Image from "next/image";
import Link from "next/link";
import { formatRegionLabel } from "@/lib/format/location";
import type { PlaceRow } from "@/types/database";

type PlaceCardVariant = "grid" | "featured";

type PlaceCardProps = {
  place: PlaceRow;
  href?: string | null;
  variant?: PlaceCardVariant;
};

const variantStyles = {
  grid: {
    shell:
      "group flex h-full flex-col overflow-hidden rounded-md border border-default bg-surface shadow-card transition hover:-translate-y-0.5 hover:border-brand-muted hover:shadow-floating focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover",
    media: "relative aspect-[4/3] w-full overflow-hidden bg-[color:var(--color-accent)]",
    image:
      "object-cover transition duration-300 group-hover:scale-105",
    imageSizes:
      "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
    body: "flex flex-1 flex-col gap-5 p-5 sm:p-6",
    meta: "flex min-h-8 items-center gap-2 text-base font-medium",
    categoryChip:
      "shrink-0 rounded-full bg-[color:var(--color-accent)] px-3 py-1 text-link",
    region: "min-w-0 truncate text-stone",
    title: "text-2xl font-semibold tracking-normal text-ink",
    titleWrap: "space-y-2",
    memory: "text-lg leading-8 text-stone",
    footer: "mt-auto border-t border-border-muted pt-4",
    footerLabel: "text-base font-medium text-stone",
    footerValue: "mt-1 text-lg font-semibold text-link",
    emptyTitle: "text-xl font-semibold text-link",
    emptyDescription: "text-base font-medium leading-7 text-stone",
    emptyWrap:
      "flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center",
  },
  featured: {
    shell:
      "block overflow-hidden rounded-xl border border-default/80 bg-surface shadow-card focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover",
    media:
      "relative h-[236px] w-full overflow-hidden bg-[color:var(--color-accent)] sm:h-[252px] lg:h-[260px]",
    image: "object-cover",
    imageSizes:
      "(min-width: 1024px) 340px, (min-width: 768px) 50vw, 100vw",
    body: "flex min-h-[270px] flex-col px-6 pb-6 pt-5 sm:px-7 sm:pb-7 sm:pt-6",
    meta: "flex min-h-7 items-center gap-2 text-sm font-medium text-stone",
    categoryChip:
      "shrink-0 rounded-full bg-[color:var(--color-accent)]/80 px-3 py-1 text-link",
    region: "min-w-0 truncate",
    title:
      "text-[1.45rem] font-semibold leading-snug tracking-normal text-ink",
    titleWrap: "mt-5 space-y-3",
    memory: "text-[17px] leading-8 text-stone",
    footer: "mt-auto border-t border-border-muted pt-5",
    footerLabel: "text-sm font-medium text-stone/80",
    footerValue: "mt-2 text-base font-semibold leading-7 text-link",
    emptyTitle: "text-base font-semibold leading-7 text-link",
    emptyDescription: "",
    emptyWrap:
      "flex h-full w-full items-center justify-center px-6 text-center",
  },
} as const;

function PlaceCardMedia({
  place,
  variant,
}: {
  place: PlaceRow;
  variant: PlaceCardVariant;
}) {
  const styles = variantStyles[variant];

  return (
    <div className={styles.media}>
      {place.image_url ? (
        <Image
          src={place.image_url}
          alt={`${place.name} 사진`}
          fill
          sizes={styles.imageSizes}
          className={styles.image}
        />
      ) : variant === "grid" ? (
        <div className={styles.emptyWrap}>
          <span className={styles.emptyTitle}>사진이 아직 없어요</span>
          <span className={styles.emptyDescription}>
            좋은 순간을 사진으로 남겨보세요
          </span>
        </div>
      ) : (
        <div className={styles.emptyWrap}>
          <span className={styles.emptyTitle}>사진이 아직 없어요</span>
        </div>
      )}
    </div>
  );
}

export default function PlaceCard({
  place,
  href,
  variant = "grid",
}: PlaceCardProps) {
  const cardHref = href === undefined ? `/places/${place.id}` : href;
  const styles = variantStyles[variant];
  const regionLabel = formatRegionLabel(place.road_address ?? place.region);

  const cardContent = (
    <>
      <PlaceCardMedia place={place} variant={variant} />
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.categoryChip}>{place.category}</span>
          {regionLabel ? (
            <span className={styles.region}>{regionLabel}</span>
          ) : null}
        </div>
        <div className={styles.titleWrap}>
          <h3 className={styles.title}>{place.name}</h3>
          <p className={styles.memory}>{place.memory}</p>
        </div>
        <div className={styles.footer}>
          <p className={styles.footerLabel}>다시 가고 싶은 마음</p>
          <p className={styles.footerValue}>{place.revisit_level}</p>
        </div>
      </div>
    </>
  );

  if (!cardHref) {
    return <article className={styles.shell}>{cardContent}</article>;
  }

  return (
    <Link
      href={cardHref}
      className={styles.shell}
      aria-label={`${place.name} 상세 보기`}
    >
      {cardContent}
    </Link>
  );
}
