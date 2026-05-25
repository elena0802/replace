import type { PlaceInsert } from "@/types/database";
import type { PlaceFormValues } from "@/types/place";

export function mapPlaceFormToInsert(
  values: PlaceFormValues,
  imageUrl: string | null = null,
): Omit<PlaceInsert, "user_id"> {
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
