import ExplorePlacesList from "@/components/ExplorePlacesList";
import PageHeader from "@/components/PageHeader";

export default function ExplorePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <PageHeader
        eyebrow="둘러보기"
        title="다시 가고 싶은 곳의 기록"
        description="사람들이 남긴 좋은 장소와 머물렀던 순간을 차분히 둘러보세요."
      />

      <ExplorePlacesList />
    </div>
  );
}
