import PlaceCardSkeleton from "@/components/skeleton/PlaceCardSkeleton";

type PlaceGridSkeletonProps = {
  count?: number;
  variant?: "grid" | "featured";
  className?: string;
};

export default function PlaceGridSkeleton({
  count = 6,
  variant = "grid",
  className = "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
}: PlaceGridSkeletonProps) {
  return (
    <div aria-busy="true" className={className}>
      <span className="sr-only">불러오는 중</span>
      {Array.from({ length: count }, (_, index) => (
        <PlaceCardSkeleton key={index} variant={variant} />
      ))}
    </div>
  );
}
