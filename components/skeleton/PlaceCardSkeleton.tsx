import SkeletonBlock from "@/components/skeleton/SkeletonBlock";

type PlaceCardSkeletonVariant = "grid" | "featured";

type PlaceCardSkeletonProps = {
  variant?: PlaceCardSkeletonVariant;
};

const sharedShellClassName =
  "flex h-full flex-col rounded-xl bg-surface shadow-card";

const variantStyles = {
  grid: {
    shell: sharedShellClassName,
    media:
      "aspect-[5/4] w-full shrink-0 overflow-hidden rounded-t-xl sm:aspect-[4/3]",
    body: "flex flex-1 flex-col gap-3 p-4 sm:gap-4 sm:p-5",
    title: "h-7 w-4/5",
    story: "h-4 w-full",
    storySecond: "h-4 w-11/12",
    storyThird: "hidden h-4 w-10/12 sm:block",
    footer: "mt-auto border-t border-border-muted/80 pt-3",
    footerLabel: "h-3 w-28",
    footerValue: "mt-2 h-8 w-3/5",
    metadata: "h-3 w-2/5",
  },
  featured: {
    shell: sharedShellClassName,
    media:
      "aspect-[5/4] w-full shrink-0 overflow-hidden rounded-t-xl sm:aspect-[4/3]",
    body: "flex flex-1 flex-col gap-3 p-4 sm:gap-4 sm:p-5",
    title: "h-7 w-4/5",
    story: "h-4 w-full",
    storySecond: "h-4 w-11/12",
    storyThird: "hidden h-4 w-10/12 sm:block",
    footer: "mt-auto border-t border-border-muted/80 pt-3",
    footerLabel: "h-3 w-28",
    footerValue: "mt-2 h-8 w-3/5",
    metadata: "h-3 w-2/5",
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
        <SkeletonBlock className={styles.title} />
        <div className="space-y-2">
          <SkeletonBlock className={styles.story} />
          <SkeletonBlock className={styles.storySecond} />
          <SkeletonBlock className={styles.storyThird} />
        </div>
        <div className={styles.footer}>
          <SkeletonBlock className={styles.footerLabel} />
          <SkeletonBlock className={styles.footerValue} />
        </div>
        <SkeletonBlock className={styles.metadata} />
      </div>
    </article>
  );
}
