import NewPlaceForm from "@/components/NewPlaceForm";

export default function NewPlacePage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="mb-8 space-y-3">
        <p className="text-lg font-medium text-[#4D5748]">기록하기</p>
        <h1 className="text-4xl font-semibold leading-tight tracking-normal text-[#3F3F3B]">
          좋은 장소와 시간을 남겨두세요
        </h1>
        <p className="text-xl leading-9 text-[#6B6B68]">
          머물렀던 순간을 나만의 아카이브로 정리하는 입력 화면입니다.
        </p>
      </div>

      <NewPlaceForm />
    </div>
  );
}
