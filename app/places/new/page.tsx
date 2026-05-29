import NewPlaceForm from "@/components/NewPlaceForm";

export default function NewPlacePage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-8 lg:px-8 lg:py-12">
      <div className="mb-6 space-y-3">
        <p className="text-lg font-medium text-[#4D5748]">기록하기</p>
        <h1 className="text-3xl font-semibold leading-tight tracking-normal text-[#3F3F3B] sm:text-4xl">
          좋은 장소와 시간을 기록하세요
        </h1>
        <p className="text-lg leading-8 text-[#6B6B68] sm:text-xl sm:leading-9">
          사진, 장소, 한 줄 기록을 먼저 남기고 나머지는 천천히 정리합니다.
        </p>
      </div>

      <NewPlaceForm />
    </div>
  );
}
