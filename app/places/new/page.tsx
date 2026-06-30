import NewPlaceForm from "@/components/NewPlaceForm";
import PageHeader from "@/components/PageHeader";

export default function NewPlacePage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-8 lg:px-8 lg:py-12">
      <PageHeader
        className="mb-6"
        eyebrow="기록하기"
        title="장소를 기록해보세요"
        description="사진, 장소, 한 줄 기록을 먼저 남기고 나머지는 천천히 정리합니다."
      />

      <NewPlaceForm />
    </div>
  );
}
