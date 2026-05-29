import type { PlaceInsert } from "@/types/database";
import type { PlaceFormValues } from "@/types/place";

export function mapPlaceFormToInsert(
  values: PlaceFormValues,
  imageUrl: string | null = null,
): Omit<PlaceInsert, "user_id"> {
  return {
    name: values.name.trim(),
    category: values.category || "기타",
    region: values.region.trim() || "위치 미정",
    memory: values.memory.trim(),
    visited_date: values.visitedDate || null,
    companion: values.companion || null,
    revisit_level: values.revisitLevel,
    space_tags: values.spaceTags,
    is_public: values.isPublic,
    image_url: imageUrl,
    ...(values.naverPlaceId !== undefined
      ? { naver_place_id: values.naverPlaceId }
      : {}),
    ...(values.roadAddress !== undefined
      ? { road_address: values.roadAddress }
      : {}),
    ...(values.mapUrl !== undefined ? { map_url: values.mapUrl } : {}),
    ...(values.latitude !== undefined ? { latitude: values.latitude } : {}),
    ...(values.longitude !== undefined ? { longitude: values.longitude } : {}),
  };
}
