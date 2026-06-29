import PlaceGridSkeleton from "@/components/skeleton/PlaceGridSkeleton";
import SkeletonBlock from "@/components/skeleton/SkeletonBlock";

export default function CollectionDetailSkeleton() {
  return (
    <div aria-busy="true" className="space-y-8">
      <span className="sr-only">불러오는 중</span>
      <section className="rounded-3xl border border-default bg-surface p-5 shadow-card sm:p-7">
        <SkeletonBlock className="aspect-[3/2] w-full rounded-xl" />
        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <SkeletonBlock className="h-6 w-24" />
              <SkeletonBlock className="h-8 w-20 rounded-full" />
            </div>
            <SkeletonBlock className="h-12 w-4/5 max-w-xl" />
            <SkeletonBlock className="h-6 w-full max-w-2xl" />
            <SkeletonBlock className="h-6 w-11/12 max-w-xl" />
          </div>
          <SkeletonBlock className="h-10 w-32 rounded-full" />
        </div>
      </section>
      <PlaceGridSkeleton count={6} />
      <SkeletonBlock className="h-12 w-44 rounded-full" />
    </div>
  );
}
