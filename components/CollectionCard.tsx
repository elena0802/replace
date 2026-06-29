import Link from "next/link";
import CollectionCoverImage from "@/components/CollectionCoverImage";
import type { CollectionListItem } from "@/lib/collections/getCollections";

type CollectionCardVariant = "grid" | "carousel";

type CollectionCardProps = {
  collection: CollectionListItem;
  variant?: CollectionCardVariant;
  visibilityMode?: "owner" | "public";
  showDate?: boolean;
  showCta?: boolean;
};

const DEFAULT_DESCRIPTION =
  "좋아하는 장소들을 조용히 모아둔 컬렉션입니다.";

const variantShellClassName = {
  grid: "h-full w-full",
  carousel: "w-[272px] shrink-0 snap-start sm:w-[288px]",
} as const;

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

function getVisibilityLabel(
  collection: CollectionListItem,
  visibilityMode: "owner" | "public",
) {
  if (visibilityMode === "public") {
    return "공개";
  }

  return collection.is_public ? "공개" : "비공개";
}

function getCoverPlaceholder(collection: CollectionListItem) {
  if (collection.placeCount === 0) {
    return {
      title: "아직 담긴 장소가 없어요",
      description: "장소를 담으면 커버가 채워집니다",
    };
  }

  return {
    title: "커버 이미지가 없어요",
    description: "이미지가 있는 장소를 담으면 커버가 채워집니다",
  };
}

export default function CollectionCard({
  collection,
  variant = "grid",
  visibilityMode = "public",
  showDate = false,
  showCta = true,
}: CollectionCardProps) {
  const placeholder = getCoverPlaceholder(collection);
  const visibilityLabel = getVisibilityLabel(collection, visibilityMode);
  const formattedDate = showDate ? formatDate(collection.created_at) : null;

  return (
    <Link
      href={`/collections/${collection.id}`}
      className={`group flex flex-col overflow-hidden rounded-xl border border-default bg-surface shadow-card transition duration-200 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover md:hover:-translate-y-0.5 md:hover:border-brand-muted md:hover:shadow-floating ${variantShellClassName[variant]}`}
      aria-label={`${collection.name} 컬렉션 보기`}
    >
      <CollectionCoverImage
        imageUrl={collection.coverImageUrl}
        title={collection.name}
        className="rounded-none rounded-t-lg border-0 border-b border-default/60"
        placeholderTitle={placeholder.title}
        placeholderDescription={placeholder.description}
      />

      <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-3.5 sm:px-5 sm:pb-5 sm:pt-4">
        <div className="flex items-center justify-between gap-3 text-xs text-meta">
          <p className="line-clamp-1">
            {collection.placeCount}곳 · {visibilityLabel}
          </p>
          {formattedDate ? (
            <time
              dateTime={collection.created_at}
              className="shrink-0 text-meta/80"
            >
              {formattedDate}
            </time>
          ) : null}
        </div>

        <div className="space-y-2">
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug tracking-normal text-ink sm:text-xl">
            {collection.name}
          </h3>
          <p className="line-clamp-2 text-sm leading-6 text-stone">
            {collection.description?.trim() || DEFAULT_DESCRIPTION}
          </p>
        </div>

        {showCta ? (
          <span className="mt-auto pt-1 text-sm font-semibold text-brand transition group-hover:text-link">
            열어보기
          </span>
        ) : null}
      </div>
    </Link>
  );
}
