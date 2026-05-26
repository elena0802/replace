export type CroppedAreaPixels = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function loadImage(imageSrc: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error("Selected image could not be loaded for cropping."));
    image.src = imageSrc;
  });
}

function getOutputType(sourceType: string) {
  if (
    sourceType === "image/jpeg" ||
    sourceType === "image/png" ||
    sourceType === "image/webp"
  ) {
    return sourceType;
  }

  return "image/jpeg";
}

function getOutputExtension(outputType: string) {
  if (outputType === "image/png") {
    return "png";
  }

  if (outputType === "image/webp") {
    return "webp";
  }

  return "jpg";
}

function getCroppedFileName(sourceName: string, outputType: string) {
  const dotIndex = sourceName.lastIndexOf(".");
  const baseName =
    dotIndex > 0 ? sourceName.slice(0, dotIndex) : sourceName || "place-image";

  return `cropped-${baseName}.${getOutputExtension(outputType)}`;
}

function canvasToBlob(canvas: HTMLCanvasElement, outputType: string) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Cropped image could not be created."));
          return;
        }

        resolve(blob);
      },
      outputType,
      0.92,
    );
  });
}

export async function cropImageToFile(
  imageSrc: string,
  croppedAreaPixels: CroppedAreaPixels,
  sourceFile: File,
) {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas context is not available.");
  }

  const width = Math.max(1, Math.round(croppedAreaPixels.width));
  const height = Math.max(1, Math.round(croppedAreaPixels.height));

  canvas.width = width;
  canvas.height = height;

  context.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    width,
    height,
  );

  const outputType = getOutputType(sourceFile.type);
  const blob = await canvasToBlob(canvas, outputType);

  return new File([blob], getCroppedFileName(sourceFile.name, outputType), {
    type: outputType,
    lastModified: Date.now(),
  });
}
