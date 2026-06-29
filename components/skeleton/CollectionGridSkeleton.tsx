import CollectionCardSkeleton from "@/components/skeleton/CollectionCardSkeleton";

type CollectionGridSkeletonProps = {
  count?: number;
  variant?: "grid" | "carousel";
  className?: string;
};

export default function CollectionGridSkeleton({
  count = 4,
  variant = "grid",
  className,
}: CollectionGridSkeletonProps) {
  if (variant === "carousel") {
    return (
      <div aria-busy="true" className="overflow-hidden">
        <span className="sr-only">불러오는 중</span>
        <div className="flex gap-5 overflow-x-auto pb-2 sm:gap-6">
          {Array.from({ length: count }, (_, index) => (
            <CollectionCardSkeleton key={index} variant="carousel" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      aria-busy="true"
      className={className ?? "grid gap-4 sm:grid-cols-2"}
    >
      <span className="sr-only">불러오는 중</span>
      {Array.from({ length: count }, (_, index) => (
        <CollectionCardSkeleton key={index} variant="grid" />
      ))}
    </div>
  );
}
