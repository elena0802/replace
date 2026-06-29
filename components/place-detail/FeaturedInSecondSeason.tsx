import { SECOND_SEASON_URL } from "@/config/site";

type FeaturedInSecondSeasonProps = {
  essay: {
    slug: string;
    title: string;
    excerpt?: string;
  };
};

export default function FeaturedInSecondSeason({
  essay,
}: FeaturedInSecondSeasonProps) {
  const essayUrl = `${SECOND_SEASON_URL}/journal/${essay.slug}`;

  return (
    <section
      aria-labelledby="second-season-heading"
      className="border-t border-border-muted px-5 py-8 sm:px-8 sm:py-9 lg:px-10"
    >
      <div className="mx-auto max-w-prose space-y-3">
        <p className="text-sm font-normal text-meta">관련 글</p>

        <div className="space-y-1.5">
          <h2
            id="second-season-heading"
            className="text-base font-semibold text-ink"
          >
            Second Season에 소개된 장소
          </h2>
          <p className="text-sm leading-6 text-stone">
            이 장소는 Second Season 에세이에서 다뤄졌어요.
          </p>
        </div>

        <div className="rounded-xl border border-default bg-subtle/70 p-4 sm:p-5">
          <h3 className="text-sm font-semibold leading-snug text-ink sm:text-base">
            {essay.title}
          </h3>
          {essay.excerpt ? (
            <p className="mt-2 text-sm leading-6 text-stone">{essay.excerpt}</p>
          ) : null}

          <a
            href={essayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-link underline decoration-border-muted underline-offset-4 transition-colors duration-200 hover:text-ink hover:decoration-brand-muted focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-hover"
          >
            에세이 읽기
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
