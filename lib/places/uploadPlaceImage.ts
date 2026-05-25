import { supabase } from "@/lib/supabase/client";

const placeImagesBucket = "place-images";

export class PlaceImageUploadError extends Error {
  constructor(message = "Place image upload failed.") {
    super(message);
    this.name = "PlaceImageUploadError";
  }
}

function sanitizeFileName(fileName: string) {
  const safeName = fileName
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-");

  return safeName || "place-image";
}

export async function uploadPlaceImage(file: File, userId: string) {
  const timestamp = Date.now();
  const filePath = `places/${userId}/${timestamp}-${sanitizeFileName(file.name)}`;

  const { error } = await supabase.storage
    .from(placeImagesBucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      contentType: file.type || "image/jpeg",
      upsert: false,
    });

  if (error) {
    throw new PlaceImageUploadError(
      `Supabase place image upload failed: ${error.message}`,
    );
  }

  const { data } = supabase.storage.from(placeImagesBucket).getPublicUrl(filePath);

  if (!data.publicUrl) {
    throw new PlaceImageUploadError(
      "Supabase place image upload succeeded but no public URL was returned.",
    );
  }

  return data.publicUrl;
}
