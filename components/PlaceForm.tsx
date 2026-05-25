"use client";

import { FormEvent, useState } from "react";

const categories = ["카페", "음식점", "공원", "여행지", "호텔", "기타"];
const companions = ["혼자", "부부", "가족", "친구", "기타"];
const revisitLevels = ["보통", "좋았어요", "꼭 다시 가고 싶어요"];
const visibilityOptions = ["공개", "비공개"];
const spaceInfoOptions = [
  "주차가 편해요",
  "걷기 편해요",
  "계단이 적어요",
  "화장실이 깨끗해요",
  "조용해요",
  "의자가 편해요",
  "오래 머물기 좋아요",
  "사진 찍기 좋아요",
];

type FormValues = {
  name: string;
  category: string;
  region: string;
  memory: string;
  visitedDate: string;
  companion: string;
  revisitLevel: string;
  visibility: string;
  spaceInfo: string[];
};

const initialValues: FormValues = {
  name: "",
  category: "",
  region: "",
  memory: "",
  visitedDate: "",
  companion: "",
  revisitLevel: "좋았어요",
  visibility: "공개",
  spaceInfo: [],
};

const fieldClass =
  "min-h-14 w-full rounded-2xl border border-[#E5E0D8] bg-white px-4 text-xl font-medium text-[#3F3F3B] outline-none transition placeholder:text-[#6B6B68]/60 focus:border-[#A8B2A1] focus:ring-3 focus:ring-[#A8B2A1]/20";
const labelClass = "space-y-2 text-lg font-semibold text-[#3F3F3B]";

export default function PlaceForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  function updateValue(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors([]);
    setSuccessMessage("");
  }

  function toggleSpaceInfo(option: string) {
    setValues((current) => {
      const exists = current.spaceInfo.includes(option);
      return {
        ...current,
        spaceInfo: exists
          ? current.spaceInfo.filter((item) => item !== option)
          : [...current.spaceInfo, option],
      };
    });
    setSuccessMessage("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = [
      !values.name.trim() && "장소명을 입력해주세요.",
      !values.category && "카테고리를 선택해주세요.",
      !values.region.trim() && "지역을 입력해주세요.",
      !values.memory.trim() && "기억을 입력해주세요.",
    ].filter(Boolean) as string[];

    setErrors(nextErrors);

    if (nextErrors.length > 0) {
      setSuccessMessage("");
      return;
    }

    setSuccessMessage(
      "기록 UI가 준비되었습니다. 다음 단계에서 저장 기능을 연결합니다.",
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-8 rounded-3xl border border-[#E5E0D8] bg-[#FCFBF8] p-5 shadow-[0_18px_44px_rgba(77,87,72,0.07)] sm:p-7"
    >
      {(errors.length > 0 || successMessage) && (
        <div
          className={`rounded-2xl border px-5 py-4 text-lg leading-8 ${
            successMessage
              ? "border-[#A8B2A1] bg-[#A8B2A1]/20 text-[#4D5748]"
              : "border-[#E5C8BA] bg-[#FFF8F4] text-[#7A4B3A]"
          }`}
          role={successMessage ? "status" : "alert"}
        >
          {successMessage ? (
            <p className="font-semibold">{successMessage}</p>
          ) : (
            <div>
              <p className="font-semibold">필수 항목을 확인해주세요.</p>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <section className="space-y-5">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-normal text-[#3F3F3B]">
            장소 정보
          </h2>
          <p className="text-lg leading-8 text-[#6B6B68]">
            좋은 시간을 보낸 장소를 나중에 다시 떠올릴 수 있게 남겨보세요.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className={labelClass}>
            장소명 <span className="text-[#4D5748]">*</span>
            <input
              type="text"
              value={values.name}
              onChange={(event) => updateValue("name", event.target.value)}
              placeholder="예: 봄날 정원 카페"
              className={fieldClass}
              aria-required="true"
            />
          </label>

          <label className={labelClass}>
            카테고리 <span className="text-[#4D5748]">*</span>
            <select
              value={values.category}
              onChange={(event) => updateValue("category", event.target.value)}
              className={fieldClass}
              aria-required="true"
            >
              <option value="">카테고리 선택</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className={labelClass}>
            지역 <span className="text-[#4D5748]">*</span>
            <input
              type="text"
              value={values.region}
              onChange={(event) => updateValue("region", event.target.value)}
              placeholder="예: 경기 양평"
              className={fieldClass}
              aria-required="true"
            />
          </label>

          <label className={labelClass}>
            다녀온 날짜
            <input
              type="date"
              value={values.visitedDate}
              onChange={(event) =>
                updateValue("visitedDate", event.target.value)
              }
              className={fieldClass}
            />
          </label>
        </div>

        <label className={labelClass}>
          기억 <span className="text-[#4D5748]">*</span>
          <textarea
            value={values.memory}
            onChange={(event) => updateValue("memory", event.target.value)}
            placeholder="예: 창가에 앉아 천천히 쉬었던 오후가 오래 기억에 남았어요."
            rows={5}
            className="w-full rounded-2xl border border-[#E5E0D8] bg-white px-4 py-3 text-xl font-medium leading-8 text-[#3F3F3B] outline-none transition placeholder:text-[#6B6B68]/60 focus:border-[#A8B2A1] focus:ring-3 focus:ring-[#A8B2A1]/20"
            aria-required="true"
          />
        </label>
      </section>

      <section className="space-y-5 border-t border-[#EFEAE2] pt-7">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-normal text-[#3F3F3B]">
            함께한 시간
          </h2>
          <p className="text-lg leading-8 text-[#6B6B68]">
            기록에 남겨둘 만큼만 편하게 선택하세요.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className={labelClass}>
            누구와 갔나요?
            <select
              value={values.companion}
              onChange={(event) => updateValue("companion", event.target.value)}
              className={fieldClass}
            >
              <option value="">선택 안 함</option>
              {companions.map((companion) => (
                <option key={companion} value={companion}>
                  {companion}
                </option>
              ))}
            </select>
          </label>

          <fieldset className="space-y-3">
            <legend className="text-lg font-semibold text-[#3F3F3B]">
              다시 가고 싶은 마음
            </legend>
            <div className="grid gap-3">
              {revisitLevels.map((level) => (
                <label
                  key={level}
                  className="flex min-h-14 items-center gap-3 rounded-2xl border border-[#E5E0D8] bg-white px-4 text-lg font-medium text-[#3F3F3B]"
                >
                  <input
                    type="radio"
                    name="revisitLevel"
                    value={level}
                    checked={values.revisitLevel === level}
                    onChange={(event) =>
                      updateValue("revisitLevel", event.target.value)
                    }
                    className="size-5 accent-[#4D5748]"
                  />
                  {level}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <fieldset className="space-y-3">
          <legend className="text-lg font-semibold text-[#3F3F3B]">
            공개 여부
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {visibilityOptions.map((option) => (
              <label
                key={option}
                className="flex min-h-14 items-center gap-3 rounded-2xl border border-[#E5E0D8] bg-white px-4 text-lg font-medium text-[#3F3F3B]"
              >
                <input
                  type="radio"
                  name="visibility"
                  value={option}
                  checked={values.visibility === option}
                  onChange={(event) =>
                    updateValue("visibility", event.target.value)
                  }
                  className="size-5 accent-[#4D5748]"
                />
                {option}
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section className="space-y-5 border-t border-[#EFEAE2] pt-7">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-normal text-[#3F3F3B]">
            공간 정보
          </h2>
          <p className="text-lg leading-8 text-[#6B6B68]">
            다시 찾을 때 도움이 되는 장소의 느낌을 표시해두세요.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {spaceInfoOptions.map((option) => (
            <label
              key={option}
              className="flex min-h-14 items-center gap-3 rounded-2xl border border-[#E5E0D8] bg-white px-4 text-lg font-medium text-[#3F3F3B] transition has-checked:border-[#A8B2A1] has-checked:bg-[#A8B2A1]/15"
            >
              <input
                type="checkbox"
                checked={values.spaceInfo.includes(option)}
                onChange={() => toggleSpaceInfo(option)}
                className="size-5 accent-[#4D5748]"
              />
              {option}
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-5 border-t border-[#EFEAE2] pt-7">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-normal text-[#3F3F3B]">
            사진
          </h2>
          <p className="text-lg leading-8 text-[#6B6B68]">
            사진 업로드는 다음 단계에서 실제 저장 기능과 함께 연결합니다.
          </p>
        </div>

        <button
          type="button"
          className="flex min-h-52 w-full flex-col items-center justify-center rounded-3xl border border-dashed border-[#A8B2A1] bg-[#F8F6F2] px-5 text-center transition hover:border-[#4D5748] hover:bg-[#EAE3D8]"
        >
          <span className="text-2xl font-semibold text-[#3F3F3B]">
            사진을 추가해보세요
          </span>
          <span className="mt-3 text-lg leading-8 text-[#6B6B68]">
            실제 업로드 기능은 다음 단계에서 연결됩니다.
          </span>
        </button>
      </section>

      <div className="flex flex-col gap-4 border-t border-[#EFEAE2] pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-base leading-7 text-[#6B6B68]">
          * 표시된 항목은 기록을 준비하기 위해 필요합니다.
        </p>
        <button
          type="submit"
          className="min-h-14 rounded-full bg-[#A8B2A1] px-8 py-4 text-xl font-semibold text-[#2F362D] shadow-[0_10px_24px_rgba(77,87,72,0.14)] transition hover:bg-[#4D5748] hover:text-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748]"
        >
          기록 저장하기
        </button>
      </div>
    </form>
  );
}
