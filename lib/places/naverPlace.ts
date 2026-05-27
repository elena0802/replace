import type {
  NaverPlaceSearchResult,
  PlaceCategory,
  PlaceFormValues,
} from "@/types/place";

export function mapNaverCategoryToPlaceCategory(
  category: string,
): PlaceCategory {
  if (category.includes("카페") || category.includes("커피")) {
    return "카페";
  }

  if (
    category.includes("음식") ||
    category.includes("식당") ||
    category.includes("레스토랑") ||
    category.includes("한식") ||
    category.includes("중식") ||
    category.includes("일식") ||
    category.includes("양식") ||
    category.includes("분식")
  ) {
    return "음식점";
  }

  if (category.includes("공원")) {
    return "공원";
  }

  if (
    category.includes("호텔") ||
    category.includes("숙박") ||
    category.includes("리조트") ||
    category.includes("펜션") ||
    category.includes("모텔")
  ) {
    return "호텔";
  }

  if (
    category.includes("여행") ||
    category.includes("관광") ||
    category.includes("명소") ||
    category.includes("문화") ||
    category.includes("유적") ||
    category.includes("궁궐")
  ) {
    return "여행지";
  }

  return "기타";
}

export function getPlaceAddress(place: NaverPlaceSearchResult) {
  return place.roadAddress || place.address;
}

export function createNaverMapSearchUrl(name: string) {
  return `https://map.naver.com/p/search/${encodeURIComponent(name)}`;
}

export function getSelectedPlaceFromFormValues(
  values: PlaceFormValues,
): NaverPlaceSearchResult | null {
  const hasNaverPlaceMetadata = Boolean(
    values.naverPlaceId ||
      values.roadAddress ||
      values.mapUrl ||
      values.latitude !== undefined ||
      values.longitude !== undefined,
  );

  if (!hasNaverPlaceMetadata) {
    return null;
  }

  return {
    id:
      values.naverPlaceId ||
      `${values.name}-${values.roadAddress || values.region}`,
    name: values.name,
    category: values.category || "",
    address: values.region,
    roadAddress: values.roadAddress || "",
    mapUrl: createNaverMapSearchUrl(values.name),
    latitude: values.latitude ?? null,
    longitude: values.longitude ?? null,
  };
}
