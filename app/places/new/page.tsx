const categories = ["카페", "음식점", "공원", "여행지", "호텔"];
const revisitLevels = [
  "꼭 다시 가고 싶어요",
  "다시 가고 싶어요",
  "기회가 되면 다시 가고 싶어요",
];

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

      <form className="space-y-6 rounded-3xl border border-[#E5E0D8] bg-[#FCFBF8] p-5 shadow-[0_18px_44px_rgba(77,87,72,0.07)] sm:p-7">
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="space-y-2 text-lg font-semibold text-[#3F3F3B]">
            장소명
            <input
              type="text"
              placeholder="예: 봄날 정원 카페"
              className="min-h-14 w-full rounded-2xl border border-[#E5E0D8] bg-white px-4 text-xl font-medium text-[#3F3F3B] outline-none transition placeholder:text-[#6B6B68]/60 focus:border-[#A8B2A1] focus:ring-3 focus:ring-[#A8B2A1]/20"
            />
          </label>
          <label className="space-y-2 text-lg font-semibold text-[#3F3F3B]">
            지역
            <input
              type="text"
              placeholder="예: 경기 양평"
              className="min-h-14 w-full rounded-2xl border border-[#E5E0D8] bg-white px-4 text-xl font-medium text-[#3F3F3B] outline-none transition placeholder:text-[#6B6B68]/60 focus:border-[#A8B2A1] focus:ring-3 focus:ring-[#A8B2A1]/20"
            />
          </label>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="space-y-2 text-lg font-semibold text-[#3F3F3B]">
            카테고리
            <select className="min-h-14 w-full rounded-2xl border border-[#E5E0D8] bg-white px-4 text-xl font-medium text-[#3F3F3B] outline-none transition focus:border-[#A8B2A1] focus:ring-3 focus:ring-[#A8B2A1]/20">
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-lg font-semibold text-[#3F3F3B]">
            다시 가고 싶은 마음
            <select className="min-h-14 w-full rounded-2xl border border-[#E5E0D8] bg-white px-4 text-xl font-medium text-[#3F3F3B] outline-none transition focus:border-[#A8B2A1] focus:ring-3 focus:ring-[#A8B2A1]/20">
              {revisitLevels.map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="space-y-2 text-lg font-semibold text-[#3F3F3B]">
          기억
          <textarea
            placeholder="예: 창가 자리가 편하고 커피가 부드러워 오래 쉬기 좋았어요."
            rows={4}
            className="w-full rounded-2xl border border-[#E5E0D8] bg-white px-4 py-3 text-xl font-medium leading-8 text-[#3F3F3B] outline-none transition placeholder:text-[#6B6B68]/60 focus:border-[#A8B2A1] focus:ring-3 focus:ring-[#A8B2A1]/20"
          />
        </label>

        <label className="space-y-2 text-lg font-semibold text-[#3F3F3B]">
          장소에 남기고 싶은 단서
          <input
            type="text"
            placeholder="예: 주차 편함, 조용함, 좌석 편함"
            className="min-h-14 w-full rounded-2xl border border-[#E5E0D8] bg-white px-4 text-xl font-medium text-[#3F3F3B] outline-none transition placeholder:text-[#6B6B68]/60 focus:border-[#A8B2A1] focus:ring-3 focus:ring-[#A8B2A1]/20"
          />
        </label>

        <div className="flex flex-col gap-4 rounded-2xl bg-[#EAE3D8] p-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-3 text-lg font-semibold text-[#3F3F3B]">
            <input
              type="checkbox"
              defaultChecked
              className="size-6 rounded border-[#E5E0D8] accent-[#4D5748]"
            />
            다른 사람에게 공개하기
          </label>
          <button
            type="button"
            className="min-h-14 rounded-full bg-[#A8B2A1] px-8 py-4 text-xl font-semibold text-[#2F362D] shadow-[0_10px_24px_rgba(77,87,72,0.14)] transition hover:bg-[#4D5748] hover:text-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
          >
            기록 화면 확인
          </button>
        </div>
      </form>
    </div>
  );
}
