"use client";

import { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import {
  cropImageToFile,
  type CroppedAreaPixels,
} from "@/lib/images/cropImage";

type CropPoint = {
  x: number;
  y: number;
};

type ImageCropModalProps = {
  imageSrc: string;
  sourceFile: File;
  onCancel: () => void;
  onComplete: (file: File) => void;
};

export default function ImageCropModal({
  imageSrc,
  sourceFile,
  onCancel,
  onComplete,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState<CropPoint>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedAreaPixels | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isProcessing) {
        onCancel();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProcessing, onCancel]);

  const handleCropComplete = useCallback(
    (_visibleArea: CroppedAreaPixels, nextCroppedArea: CroppedAreaPixels) => {
      setCroppedAreaPixels(nextCroppedArea);
      setErrorMessage("");
    },
    [],
  );

  async function handleComplete() {
    if (!croppedAreaPixels) {
      setErrorMessage(
        "사진 장면을 준비하지 못했습니다. 다른 사진으로 다시 시도해주세요.",
      );
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const croppedFile = await cropImageToFile(
        imageSrc,
        croppedAreaPixels,
        sourceFile,
      );
      onComplete(croppedFile);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "사진 장면을 준비하지 못했습니다. 다른 사진으로 다시 시도해주세요.",
      );
      setIsProcessing(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#2F362D]/45 px-4 py-5 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-scene-title"
    >
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-[#E5E0D8] bg-[#FCFBF8] p-5 shadow-[0_24px_80px_rgba(47,54,45,0.28)] sm:p-6">
        <div className="space-y-2">
          <h2
            id="image-scene-title"
            className="text-2xl font-semibold tracking-normal text-[#3F3F3B]"
          >
            기억하고 싶은 장면을 선택하세요
          </h2>
          <p className="text-lg leading-8 text-[#6B6B68]">
            사진을 움직이거나 확대해서 좋은 순간이 잘 보이도록 맞춰보세요.
          </p>
        </div>

        <div className="mt-5 overflow-hidden rounded-3xl border border-[#E5E0D8] bg-[#2F362D]">
          <div className="relative h-[52vh] min-h-72 max-h-[520px]">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={3 / 2}
              minZoom={1}
              maxZoom={3}
              cropShape="rect"
              showGrid={false}
              restrictPosition
              objectFit="contain"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
              cropperProps={{
                "aria-label": "장면 선택 영역",
              }}
            />
          </div>
        </div>

        <label className="mt-5 block space-y-3 text-lg font-semibold text-[#3F3F3B]">
          확대 정도
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="w-full accent-[#4D5748]"
          />
        </label>

        {errorMessage && (
          <p
            className="mt-4 rounded-2xl border border-[#E5C8BA] bg-[#FFF8F4] px-4 py-3 text-lg font-semibold leading-8 text-[#7A4B3A]"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="min-h-14 rounded-full border border-[#E5E0D8] bg-[#FCFBF8] px-6 py-3 text-lg font-semibold text-[#4D5748] transition hover:bg-[#EAE3D8] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748] disabled:cursor-not-allowed disabled:opacity-60"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleComplete}
            disabled={isProcessing}
            className="min-h-14 rounded-full bg-[#A8B2A1] px-6 py-3 text-lg font-semibold text-[#2F362D] shadow-[0_10px_24px_rgba(77,87,72,0.14)] transition hover:bg-[#4D5748] hover:text-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4D5748] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-[#A8B2A1] disabled:hover:text-[#2F362D]"
          >
            {isProcessing ? "장면을 준비하는 중..." : "이 장면으로 기록하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
