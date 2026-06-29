type SkeletonBlockProps = {
  className?: string;
};

export default function SkeletonBlock({ className = "" }: SkeletonBlockProps) {
  return (
    <div
      aria-hidden="true"
      className={`skeleton-pulse rounded-md bg-subtle ${className}`.trim()}
    />
  );
}
