import PlaceCard from "@/components/PlaceCard";
import { mockPlaces } from "@/lib/mockPlaces";

export default function ExplorePage() {
  const publicPlaces = mockPlaces.filter((place) => place.isPublic);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="mb-8 max-w-3xl space-y-3">
        <p className="text-lg font-medium text-[#4D5748]">둘러보기</p>
        <h1 className="text-4xl font-semibold leading-tight tracking-normal text-[#3F3F3B]">
          다시 가고 싶은 곳의 기록
        </h1>
        <p className="text-xl leading-9 text-[#6B6B68]">
          사람들이 남긴 좋은 장소와 머물렀던 순간을 차분히 둘러보세요.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {publicPlaces.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>
    </div>
  );
}
