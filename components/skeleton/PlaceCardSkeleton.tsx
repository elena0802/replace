import SkeletonBlock from "@/components/skeleton/SkeletonBlock";

type PlaceCardSkeletonVariant = "grid" | "featured";

type PlaceCardSkeletonProps = {
  variant?: PlaceCardSkeletonVariant;
};

const variantStyles = {
  grid: {
    shell:
      "flex h-full flex-col overflow-hidden rounded-md border border-default bg-surface shadow-card",
    media: "aspect-[4/3] w-full",
    body: "flex flex-1 flex-col gap-5 p-5 sm:p-6",
    meta: "flex gap-2",
    chip: "h-8 w-20 rounded-full",
    region: "h-5 w-16",
    title: "h-8 w-4/5",
    memory: "h-6 w-full",
    memorySecond: "h-6 w-11/12",
    footer: "mt-auto border-t border-border-muted pt-4",
    footerLabel: "h-5 w-32",
    footerValue: "mt-2 h-6 w-24",
  },
  featured: {
    shell:
      "flex h-full flex-col overflow-hidden rounded-xl border border-default/80 bg-surface shadow-card",
    media: "h-[236px] w-full sm:h-[252px] lg:h-[260px]",
    body: "flex min-h-[270px] flex-col px-6 pb-6 pt-5 sm:px-7 sm:pb-7 sm:pt-6",
    meta: "flex gap-2",
    chip: "h-7 w-16 rounded-full",
    region: "h-4 w-14",
    title: "mt-5 h-7 w-4/5",
    memory: "h-5 w-full",
    memorySecond: "h-5 w-10/12",
    footer: "mt-auto border-t border-border-muted pt-5",
    footerLabel: "h-4 w-28",
    footerValue: "mt-2 h-5 w-20",
  },
} as const;

export default function PlaceCardSkeleton({
  variant = "grid",
}: PlaceCardSkeletonProps) {
  const styles = variantStyles[variant];

  return (
    <article className={styles.shell}>
      <SkeletonBlock className={styles.media} />
      <div className={styles.body}>
        <div className={styles.meta}>
          <SkeletonBlock className={styles.chip} />
          <SkeletonBlock className={styles.region} />
        </div>
        <div className="space-y-3">
          <SkeletonBlock className={styles.title} />
          <SkeletonBlock className={styles.memory} />
          <SkeletonBlock className={styles.memorySecond} />
        </div>
        <div className={styles.footer}>
          <SkeletonBlock className={styles.footerLabel} />
          <SkeletonBlock className={styles.footerValue} />
        </div>
      </div>
    </article>
  );
}
