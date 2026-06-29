import CollectionGridSkeleton from "@/components/skeleton/CollectionGridSkeleton";
import SkeletonBlock from "@/components/skeleton/SkeletonBlock";

export default function CollectionsListSkeleton() {
  return (
    <div
      aria-busy="true"
      className="grid gap-8 lg:grid-cols-[360px_1fr] lg:items-start"
    >
      <span className="sr-only">불러오는 중</span>
      <div className="rounded-3xl border border-default bg-surface p-5 shadow-card sm:p-6">
        <SkeletonBlock className="h-8 w-32" />
        <SkeletonBlock className="mt-3 h-6 w-full" />
        <SkeletonBlock className="mt-6 h-13 w-full rounded-2xl" />
        <SkeletonBlock className="mt-4 h-28 w-full rounded-2xl" />
        <SkeletonBlock className="mt-5 h-24 w-full rounded-2xl" />
        <SkeletonBlock className="mt-5 h-13 w-full rounded-full" />
      </div>
      <div className="space-y-10">
        <section className="space-y-4">
          <SkeletonBlock className="h-9 w-36" />
          <SkeletonBlock className="h-6 w-72" />
          <CollectionGridSkeleton count={2} />
        </section>
        <section className="space-y-4">
          <SkeletonBlock className="h-9 w-40" />
          <SkeletonBlock className="h-6 w-80" />
          <CollectionGridSkeleton count={2} />
        </section>
      </div>
    </div>
  );
}
