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

const sharedShellClassName =
  "group flex h-full flex-col rounded-xl bg-surface shadow-card transition duration-200 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover md:hover:-translate-y-[3px] md:hover:shadow-floating";

const variantStyles = {
  grid: {
    shell: sharedShellClassName,
    media:
      "relative aspect-[5/4] w-full shrink-0 overflow-hidden rounded-t-xl bg-[color:var(--color-accent)] sm:aspect-[4/3]",
    image:
      "object-cover transition duration-200 md:group-hover:scale-[1.02]",
    imageSizes:
      "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
    body: "flex flex-1 flex-col gap-3 p-4 sm:gap-4 sm:p-5",
    title: "line-clamp-2 text-xl font-semibold leading-snug tracking-normal text-ink",
    story:
      "line-clamp-2 text-sm leading-relaxed text-stone sm:line-clamp-3",
    footer: "mt-auto border-t border-border-muted/80 pt-3",
    footerLabel: "text-xs font-medium text-meta",
    footerValue: "mt-1 line-clamp-2 text-sm leading-6 text-stone",
    metadata: "line-clamp-1 text-xs text-meta",
    emptyTitle: "text-lg font-semibold text-link",
    emptyDescription: "text-sm leading-6 text-stone",
    emptyWrap:
      "flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center",
  },
  featured: {
    shell: sharedShellClassName,
    media:
      "relative aspect-[5/4] w-full shrink-0 overflow-hidden rounded-t-xl bg-[color:var(--color-accent)] sm:aspect-[4/3]",
    image:
      "object-cover transition duration-200 md:group-hover:scale-[1.02]",
    imageSizes:
      "(min-width: 1024px) 340px, (min-width: 768px) 50vw, 100vw",
    body: "flex flex-1 flex-col gap-3 p-4 sm:gap-4 sm:p-5",
    title: "line-clamp-2 text-xl font-semibold leading-snug tracking-normal text-ink",
    story:
      "line-clamp-2 text-sm leading-relaxed text-stone sm:line-clamp-3",
    footer: "mt-auto border-t border-border-muted/80 pt-3",
    footerLabel: "text-xs font-medium text-meta",
    footerValue: "mt-1 line-clamp-2 text-sm leading-6 text-stone",
    metadata: "line-clamp-1 text-xs text-meta",
    emptyTitle: "text-base font-semibold text-link",
    emptyDescription: "",
    emptyWrap:
      "flex h-full w-full items-center justify-center px-6 text-center",
  },
} as const;

function buildMetadataLine(category: string, regionLabel: string) {
  return [category, regionLabel].filter(Boolean).join(" · ");
}

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
  const metadataLine = buildMetadataLine(place.category, regionLabel);

  const cardContent = (
    <>
      <PlaceCardMedia place={place} variant={variant} />
      <div className={styles.body}>
        <h3 className={styles.title}>{place.name}</h3>

        {place.memory.trim() ? (
          <p className={styles.story}>{place.memory}</p>
        ) : null}

        <div className={styles.footer}>
          <p className={styles.footerLabel}>다시 가고 싶은 마음</p>
          <p className={styles.footerValue}>{place.revisit_level}</p>
        </div>

        {metadataLine ? (
          <p className={styles.metadata}>{metadataLine}</p>
        ) : null}
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
