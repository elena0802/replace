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
      className={`relative aspect-[16/10] w-full overflow-hidden border border-default bg-subtle ${className}`}
    >
      {imageUrl ? (
        <div
          className="h-full w-full bg-cover bg-center transition duration-300 md:group-hover:scale-[1.02]"
          role="img"
          aria-label={`${title} 커버 이미지`}
          style={{ backgroundImage: `url("${imageUrl}")` }}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 px-5 text-center">
          <span className="text-sm font-semibold text-link">
            {placeholderTitle}
          </span>
          <span className="text-xs leading-5 text-stone">
            {placeholderDescription}
          </span>
        </div>
      )}
    </div>
  );
}
