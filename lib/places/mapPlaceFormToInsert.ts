import type { PlaceInsert } from "@/types/database";
import type { PlaceFormValues } from "@/types/place";

export function mapPlaceFormToInsert(
  values: PlaceFormValues,
  imageUrl: string | null = null,
): Omit<PlaceInsert, "user_id"> {
  // TODO: places 테이블에 컬럼이 추가되면 naverPlaceId, roadAddress, mapUrl,
  // latitude, longitude도 함께 insert payload에 매핑한다.
  return {
    name: values.name.trim(),
    category: values.category,
    region: values.region.trim(),
    memory: values.memory.trim(),
    visited_date: values.visitedDate || null,
    companion: values.companion || null,
    revisit_level: values.revisitLevel,
    space_tags: values.spaceTags,
    is_public: values.isPublic,
    image_url: imageUrl,
  };
}
