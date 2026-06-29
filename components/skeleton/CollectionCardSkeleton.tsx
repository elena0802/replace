import SkeletonBlock from "@/components/skeleton/SkeletonBlock";

type CollectionCardSkeletonVariant = "grid" | "carousel";

type CollectionCardSkeletonProps = {
  variant?: CollectionCardSkeletonVariant;
};

export default function CollectionCardSkeleton({
  variant = "grid",
}: CollectionCardSkeletonProps) {
  if (variant === "carousel") {
    return (
      <article className="flex w-[272px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-default bg-surface shadow-card sm:w-[288px]">
        <SkeletonBlock className="aspect-[16/10] w-full rounded-none rounded-t-lg" />
        <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-3.5 sm:px-5 sm:pb-5 sm:pt-4">
          <SkeletonBlock className="h-3 w-24" />
          <div className="space-y-2">
            <SkeletonBlock className="h-6 w-4/5" />
            <SkeletonBlock className="h-6 w-full" />
            <SkeletonBlock className="h-4 w-11/12" />
          </div>
          <SkeletonBlock className="mt-auto h-4 w-16" />
        </div>
      </article>
    );
  }

  return (
    <article className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-default bg-surface shadow-card">
      <SkeletonBlock className="aspect-[16/10] w-full rounded-none rounded-t-lg" />
      <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-3.5 sm:px-5 sm:pb-5 sm:pt-4">
        <SkeletonBlock className="h-3 w-28" />
        <div className="space-y-2">
          <SkeletonBlock className="h-6 w-4/5" />
          <SkeletonBlock className="h-6 w-full" />
          <SkeletonBlock className="h-4 w-10/12" />
        </div>
        <SkeletonBlock className="mt-auto h-4 w-16" />
      </div>
    </article>
  );
}
