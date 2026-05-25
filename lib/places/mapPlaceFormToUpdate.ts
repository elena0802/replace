import type { PlaceUpdate } from "@/types/database";
import type { PlaceFormValues } from "@/types/place";

export function mapPlaceFormToUpdate(
  values: PlaceFormValues,
  imageUrl?: string | null,
): PlaceUpdate {
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
    ...(imageUrl !== undefined ? { image_url: imageUrl } : {}),
  };
}
