import Image from "next/image";
import Link from "next/link";

const collections = [
  {
    label: "오늘의 기록",
    title: "엄마와 함께한 따뜻한 식당 모음",
    count: "23곳",
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "지영",
    title: "혼자만 알고 싶은 조용한 카페",
    count: "12곳",
    imageUrl:
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "민수",
    title: "여행지에서 만난 좋은 숙소들",
    count: "8곳",
    imageUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "하은",
    title: "주말에 가기 좋은 브런치 카페",
    count: "16곳",
    imageUrl:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80",
  },
];

export default function CollectionsSection() {
  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-base font-medium text-[#6B6B68]">
            사람들의 취향이 담긴 컬렉션
          </p>
          <h2 className="mt-2 max-w-2xl text-[1.8rem] font-semibold leading-tight tracking-normal text-[#3F3F3B] sm:text-[2rem]">
            비슷한 순간들이 모이면 하나의 취향이 됩니다
          </h2>
        </div>
        <Link
          href="/explore"
          className="text-base font-semibold text-[#6B6B68] transition hover:text-[#4D5748] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
        >
          전체 보기 →
        </Link>
      </div>

      <div className="overflow-hidden">
        <div className="flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] sm:gap-6 [&::-webkit-scrollbar]:hidden">
          {collections.map((collection) => (
            <article
              key={collection.title}
              className="w-[238px] shrink-0 overflow-hidden rounded-[22px] border border-[#E5E0D8]/80 bg-[#FCFBF8] shadow-[0_14px_30px_rgba(77,87,72,0.04)] sm:w-[252px]"
            >
              <div className="relative h-[158px] w-full overflow-hidden bg-[#EAE3D8] sm:h-[172px]">
                <Image
                  src={collection.imageUrl}
                  alt={`${collection.title} 이미지`}
                  fill
                  sizes="252px"
                  className="object-cover"
                />
              </div>
              <div className="space-y-3 px-5 pb-5 pt-4">
                <p className="text-sm font-medium text-[#8A857D]">
                  {collection.label}
                </p>
                <h3 className="min-h-[3.25rem] text-[1.18rem] font-semibold leading-snug tracking-normal text-[#3F3F3B]">
                  {collection.title}
                </h3>
                <p className="text-sm font-semibold text-[#6B6B68]">
                  {collection.count}
                </p>
              </div>
            </article>
          ))}

          <article className="flex min-h-[286px] w-[180px] shrink-0 flex-col items-center justify-center gap-4 rounded-[22px] border border-[#E5E0D8]/70 bg-[#EEE8DE]/65 px-5 text-center sm:min-h-[320px] sm:w-[200px]">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FCFBF8] text-2xl font-light leading-none text-[#6B6B68] shadow-[0_10px_22px_rgba(77,87,72,0.05)]">
              +
            </div>
            <p className="text-base font-semibold leading-7 text-[#4D5748]">
              나만의 컬렉션 만들기
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
