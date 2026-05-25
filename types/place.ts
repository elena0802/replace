export type PlaceCategory =
  | "카페"
  | "음식점"
  | "공원"
  | "여행지"
  | "호텔"
  | "기타";

export type Companion = "혼자" | "부부" | "가족" | "친구" | "기타";

export type RevisitLevel = "보통" | "좋았어요" | "꼭 다시 가고 싶어요";

export interface PlaceFormValues {
  name: string;
  category: PlaceCategory | "";
  region: string;
  memory: string;
  visitedDate: string;
  companion: Companion | "";
  revisitLevel: RevisitLevel;
  isPublic: boolean;
  spaceTags: string[];
}
