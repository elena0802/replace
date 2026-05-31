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
    <section className="border-t border-[#EFEAE2] px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-2xl space-y-5">
        <p className="text-sm font-medium tracking-[0.14em] text-[#8A857D]">
          SECOND SEASON
        </p>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-normal text-[#3F3F3B] sm:text-[1.65rem]">
            Featured in Second Season
          </h2>
          <p className="text-lg leading-8 text-[#6B6B68]">
            This place was featured in a Second Season essay.
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5E0D8] bg-[#F8F6F2] p-5 sm:p-6">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold leading-snug text-[#3F3F3B]">
              {essay.title}
            </h3>
            {essay.excerpt ? (
              <p className="text-base leading-7 text-[#6B6B68]">{essay.excerpt}</p>
            ) : null}
          </div>

          <a
            href={essayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-base font-medium text-[#4D5748] underline decoration-[#C9C2B8] underline-offset-4 transition hover:text-[#3F3F3B] hover:decoration-[#4D5748] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
          >
            Read Essay
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
