import type { PlaceRow } from "@/types/database";
import type {
  Companion,
  PlaceCategory,
  PlaceFormValues,
  RevisitLevel,
} from "@/types/place";

const placeCategories: PlaceCategory[] = [
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

function toPlaceCategory(value: string): PlaceCategory | "" {
  return placeCategories.includes(value as PlaceCategory)
    ? (value as PlaceCategory)
    : "";
}

function toCompanion(value: string | null): Companion | "" {
  if (!value) {
    return "";
  }

  return companions.includes(value as Companion) ? (value as Companion) : "";
}

function toRevisitLevel(value: string): RevisitLevel {
  return revisitLevels.includes(value as RevisitLevel)
    ? (value as RevisitLevel)
    : "좋았어요";
}

export function mapPlaceRowToForm(place: PlaceRow): PlaceFormValues {
  return {
    name: place.name,
    category: toPlaceCategory(place.category),
    region: place.region,
    memory: place.memory,
    visitedDate: place.visited_date ?? "",
    companion: toCompanion(place.companion),
    revisitLevel: toRevisitLevel(place.revisit_level),
    isPublic: place.is_public,
    spaceTags: place.space_tags ?? [],
  };
}
