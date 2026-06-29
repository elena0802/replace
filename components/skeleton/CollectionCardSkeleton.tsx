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
      <article className="flex w-[238px] shrink-0 flex-col overflow-hidden rounded-lg border border-default/80 bg-surface shadow-card sm:w-[252px]">
        <SkeletonBlock className="aspect-[3/2] w-full rounded-none" />
        <div className="space-y-3 px-5 pb-5 pt-4">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-12 w-full" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-4/5" />
        </div>
      </article>
    );
  }

  return (
    <article className="flex h-full flex-col rounded-3xl border border-default bg-surface p-4 shadow-card">
      <SkeletonBlock className="aspect-[3/2] w-full rounded-xl" />
      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="flex gap-2">
          <SkeletonBlock className="h-8 w-14 rounded-full" />
          <SkeletonBlock className="h-8 w-16 rounded-full" />
        </div>
        <SkeletonBlock className="h-5 w-20" />
      </div>
      <div className="mt-5 space-y-3">
        <SkeletonBlock className="h-9 w-4/5" />
        <SkeletonBlock className="h-6 w-full" />
        <SkeletonBlock className="h-6 w-11/12" />
      </div>
      <SkeletonBlock className="mt-auto h-6 w-20 pt-6" />
    </article>
  );
}
