"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { createPlace } from "@/lib/places/createPlace";
import { mapPlaceFormToInsert } from "@/lib/places/mapPlaceFormToInsert";
import type {
  Companion,
  PlaceCategory,
  PlaceFormValues,
  RevisitLevel,
} from "@/types/place";

const categories: PlaceCategory[] = [
  "카페",
  "음식점",
  "공원",
  "여행지",
  "호텔",
  "기타",
];
const companions: Companion[] = ["혼자", "부부", "가족", "친구", "기타"];
const revisitLevels: RevisitLevel[] = [
  "보통",
  "좋았어요",
  "꼭 다시 가고 싶어요",
];
const visibilityOptions = [
  { label: "공개", value: true },
  { label: "비공개", value: false },
];
const spaceTagOptions = [
  "주차가 편해요",
  "걷기 편해요",
  "계단이 적어요",
  "화장실이 깨끗해요",
  "조용해요",
  "의자가 편해요",
  "오래 머물기 좋아요",
  "사진 찍기 좋아요",
];

const emptyPlaceFormValues: PlaceFormValues = {
  name: "",
  category: "",
  region: "",
  memory: "",
  visitedDate: "",
  companion: "",
  revisitLevel: "좋았어요",
  isPublic: true,
  spaceTags: [],
};

const formMessages = {
  create: {
    submitting: "기록하는 중...",
    submit: "기록 저장하기",
    completed: "기록 완료",
    success: "좋은 장소가 기록되었습니다.",
    error: "기록을 저장하지 못했습니다. Supabase 설정과 테이블을 확인해주세요.",
  },
  edit: {
    submitting: "수정하는 중...",
    submit: "수정 저장하기",
    completed: "수정 완료",
    success: "장소 기록이 수정되었습니다.",
    error:
      "장소 기록을 수정하지 못했습니다. Supabase 설정과 테이블을 확인해주세요.",
  },
};

const fieldClass =
  "min-h-14 w-full rounded-2xl border border-[#E5E0D8] bg-white px-4 text-xl font-medium text-[#3F3F3B] outline-none transition placeholder:text-[#6B6B68]/60 focus:border-[#A8B2A1] focus:ring-3 focus:ring-[#A8B2A1]/20";
const labelClass = "space-y-2 text-lg font-semibold text-[#3F3F3B]";

type RequiredField = "name" | "category" | "region" | "memory";
type FieldErrors = Partial<Record<RequiredField, string>>;
type PlaceFormMode = "create" | "edit";
type PlaceFormSubmitResult = { redirectPath?: string } | void;

type PlaceFormProps = {
  initialValues?: PlaceFormValues;
  mode?: PlaceFormMode;
  onSubmit?: (values: PlaceFormValues) => Promise<PlaceFormSubmitResult>;
  successRedirectPath?: string;
};

function isRequiredField(field: keyof PlaceFormValues): field is RequiredField {
  return (
    field === "name" ||
    field === "category" ||
    field === "region" ||
    field === "memory"
  );
}

function getSubmitRedirectPath(result: unknown) {
  if (typeof result !== "object" || result === null || !("redirectPath" in result)) {
    return undefined;
  }

  const redirectCandidate = (result as { redirectPath?: unknown }).redirectPath;

  return typeof redirectCandidate === "string" ? redirectCandidate : undefined;
}

export default function PlaceForm({
  initialValues = emptyPlaceFormValues,
  mode = "create",
  onSubmit,
  successRedirectPath,
}: PlaceFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<PlaceFormValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const regionRef = useRef<HTMLInputElement>(null);
  const memoryRef = useRef<HTMLTextAreaElement>(null);
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasErrors = Object.keys(errors).length > 0;
  const isSubmitDisabled = isSubmitting || Boolean(successMessage);
  const messages = formMessages[mode];
  const redirectPath =
    successRedirectPath ?? (mode === "create" ? "/my-places" : undefined);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  function focusField(field: RequiredField) {
    const refs = {
      name: nameRef,
      category: categoryRef,
      region: regionRef,
      memory: memoryRef,
    };

    refs[field].current?.focus();
  }

  function updateValue<Field extends keyof PlaceFormValues>(
    field: Field,
    value: PlaceFormValues[Field],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    if (isRequiredField(field)) {
      setErrors((current) => {
        const nextErrors = { ...current };
        delete nextErrors[field];
        return nextErrors;
      });
    }
    setSuccessMessage("");
    setSubmitError("");
  }

  function toggleSpaceTag(tag: string) {
    setValues((current) => {
      const exists = current.spaceTags.includes(tag);
      return {
        ...current,
        spaceTags: exists
          ? current.spaceTags.filter((item) => item !== tag)
          : [...current.spaceTags, tag],
      };
    });
    setSuccessMessage("");
    setSubmitError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const nextErrors: FieldErrors = {};

    if (!values.name.trim()) {
      nextErrors.name = "장소명을 입력해주세요.";
    }

    if (!values.category) {
      nextErrors.category = "카테고리를 선택해주세요.";
    }

    if (!values.region.trim()) {
      nextErrors.region = "지역을 입력해주세요.";
    }

    if (!values.memory.trim()) {
      nextErrors.memory = "기억을 입력해주세요.";
    }

    setErrors(nextErrors);

    const firstErrorField = (
      ["name", "category", "region", "memory"] as RequiredField[]
    ).find((field) => nextErrors[field]);

    if (firstErrorField) {
      setSuccessMessage("");
      setSubmitError("");
      focusField(firstErrorField);
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage("");
    setSubmitError("");

    try {
      const submitResult = onSubmit
        ? await onSubmit(values)
        : await createPlace(mapPlaceFormToInsert(values));

      if (!onSubmit) {
        console.log("Created place:", JSON.stringify(submitResult));
      }

      setSuccessMessage(messages.success);

      const nextRedirectPath = getSubmitRedirectPath(submitResult) ?? redirectPath;

      if (nextRedirectPath) {
        redirectTimeoutRef.current = setTimeout(() => {
          router.push(nextRedirectPath);
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      setSubmitError(messages.error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-8 rounded-3xl border border-[#E5E0D8] bg-[#FCFBF8] p-5 shadow-[0_18px_44px_rgba(77,87,72,0.07)] sm:p-7"
    >
      {(hasErrors || successMessage || submitError) && (
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
          ) : submitError ? (
            <p className="font-semibold">{submitError}</p>
          ) : (
            <p className="font-semibold">
              필수 항목을 확인해주세요. 첫 번째 표시된 항목부터 입력해주세요.
            </p>
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
              ref={nameRef}
              value={values.name}
              onChange={(event) => updateValue("name", event.target.value)}
              placeholder="예: 봄날 정원 카페"
              className={fieldClass}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              aria-required="true"
            />
            {errors.name && (
              <span id="name-error" className="block text-base text-[#7A4B3A]">
                {errors.name}
              </span>
            )}
          </label>

          <label className={labelClass}>
            카테고리 <span className="text-[#4D5748]">*</span>
            <select
              ref={categoryRef}
              value={values.category}
              onChange={(event) =>
                updateValue(
                  "category",
                  event.target.value as PlaceCategory | "",
                )
              }
              className={fieldClass}
              aria-invalid={Boolean(errors.category)}
              aria-describedby={errors.category ? "category-error" : undefined}
              aria-required="true"
            >
              <option value="">카테고리 선택</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <span
                id="category-error"
                className="block text-base text-[#7A4B3A]"
              >
                {errors.category}
              </span>
            )}
          </label>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className={labelClass}>
            지역 <span className="text-[#4D5748]">*</span>
            <input
              type="text"
              ref={regionRef}
              value={values.region}
              onChange={(event) => updateValue("region", event.target.value)}
              placeholder="예: 경기 양평"
              className={fieldClass}
              aria-invalid={Boolean(errors.region)}
              aria-describedby={errors.region ? "region-error" : undefined}
              aria-required="true"
            />
            {errors.region && (
              <span id="region-error" className="block text-base text-[#7A4B3A]">
                {errors.region}
              </span>
            )}
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
            ref={memoryRef}
            value={values.memory}
            onChange={(event) => updateValue("memory", event.target.value)}
            placeholder="예: 창가에 앉아 천천히 쉬었던 오후가 오래 기억에 남았어요."
            rows={5}
            className="w-full rounded-2xl border border-[#E5E0D8] bg-white px-4 py-3 text-xl font-medium leading-8 text-[#3F3F3B] outline-none transition placeholder:text-[#6B6B68]/60 focus:border-[#A8B2A1] focus:ring-3 focus:ring-[#A8B2A1]/20"
            aria-invalid={Boolean(errors.memory)}
            aria-describedby={errors.memory ? "memory-error" : undefined}
            aria-required="true"
          />
          {errors.memory && (
            <span id="memory-error" className="block text-base text-[#7A4B3A]">
              {errors.memory}
            </span>
          )}
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
              onChange={(event) =>
                updateValue("companion", event.target.value as Companion | "")
              }
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
                      updateValue(
                        "revisitLevel",
                        event.target.value as RevisitLevel,
                      )
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
                key={option.label}
                className="flex min-h-14 items-center gap-3 rounded-2xl border border-[#E5E0D8] bg-white px-4 text-lg font-medium text-[#3F3F3B]"
              >
                <input
                  type="radio"
                  name="isPublic"
                  checked={values.isPublic === option.value}
                  onChange={() => updateValue("isPublic", option.value)}
                  className="size-5 accent-[#4D5748]"
                />
                {option.label}
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
          {spaceTagOptions.map((option) => (
            <label
              key={option}
              className="flex min-h-14 items-center gap-3 rounded-2xl border border-[#E5E0D8] bg-white px-4 text-lg font-medium text-[#3F3F3B] transition has-checked:border-[#A8B2A1] has-checked:bg-[#A8B2A1]/15"
            >
              <input
                type="checkbox"
                checked={values.spaceTags.includes(option)}
                onChange={() => toggleSpaceTag(option)}
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
          disabled={isSubmitDisabled}
          className="min-h-14 rounded-full bg-[#A8B2A1] px-8 py-4 text-xl font-semibold text-[#2F362D] shadow-[0_10px_24px_rgba(77,87,72,0.14)] transition hover:bg-[#4D5748] hover:text-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-[#A8B2A1] disabled:hover:text-[#2F362D]"
        >
          {isSubmitting
            ? messages.submitting
            : successMessage
              ? messages.completed
              : messages.submit}
        </button>
      </div>
    </form>
  );
}
