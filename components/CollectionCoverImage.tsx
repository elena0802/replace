type CollectionCoverImageProps = {
  imageUrl: string | null;
  title: string;
  className?: string;
  placeholderTitle?: string;
  placeholderDescription?: string;
};

export default function CollectionCoverImage({
  imageUrl,
  title,
  className = "",
  placeholderTitle = "아직 담긴 장소가 없어요",
  placeholderDescription = "장소를 담으면 커버가 채워집니다",
}: CollectionCoverImageProps) {
  return (
    <div
      className={`relative aspect-[3/2] w-full overflow-hidden rounded-xl border border-default bg-[color:var(--color-accent)] ${className}`}
    >
      {imageUrl ? (
        <div
          className="h-full w-full bg-cover bg-center transition duration-300 group-hover:scale-[1.03]"
          role="img"
          aria-label={`${title} 커버 이미지`}
          style={{ backgroundImage: `url("${imageUrl}")` }}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center">
          <span className="text-xl font-semibold text-link">
            {placeholderTitle}
          </span>
          <span className="text-base font-medium leading-7 text-stone">
            {placeholderDescription}
          </span>
        </div>
      )}
    </div>
  );
}
