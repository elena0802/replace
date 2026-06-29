const SIDO_ABBREVIATIONS: Record<string, string> = {
  서울특별시: "서울",
  부산광역시: "부산",
  대구광역시: "대구",
  인천광역시: "인천",
  광주광역시: "광주",
  대전광역시: "대전",
  울산광역시: "울산",
  세종특별자치시: "세종",
  경기도: "경기",
  강원특별자치도: "강원",
  강원도: "강원",
  충청북도: "충북",
  충청남도: "충남",
  전라북도: "전북",
  전북특별자치도: "전북",
  전라남도: "전남",
  경상북도: "경북",
  경상남도: "경남",
  제주특별자치도: "제주",
};

const SHORT_SIDO = new Set(Object.values(SIDO_ABBREVIATIONS));

const MISSING_LOCATION_LABEL = "지역 정보 없음";
const UNKNOWN_LOCATION_VALUES = new Set(["위치 미정", MISSING_LOCATION_LABEL]);

type RegionStrategy = "metro" | "sejong" | "jeju" | "province";

function abbreviateSido(sido: string): string {
  return SIDO_ABBREVIATIONS[sido] ?? sido;
}

function getRegionStrategy(sido: string): RegionStrategy {
  if (sido === "서울특별시" || sido.endsWith("광역시")) {
    return "metro";
  }

  if (sido === "세종특별자치시") {
    return "sejong";
  }

  if (sido === "제주특별자치도") {
    return "jeju";
  }

  return "province";
}

function isCityToken(token: string): boolean {
  return token.endsWith("시") && !token.includes("특별");
}

function findDistrict(parts: string[]): string | null {
  for (const part of parts.slice(1)) {
    if (part.endsWith("구")) {
      return part;
    }
  }

  return null;
}

function findCityOrCounty(parts: string[]): string | null {
  for (const part of parts.slice(1)) {
    if (isCityToken(part) || part.endsWith("군")) {
      return part;
    }
  }

  return null;
}

function findCity(parts: string[]): string | null {
  for (const part of parts.slice(1)) {
    if (isCityToken(part)) {
      return part;
    }
  }

  return null;
}

function findSejongUnit(parts: string[]): string | null {
  for (const part of parts.slice(1)) {
    if (part.endsWith("읍") || part.endsWith("면")) {
      return part;
    }
  }

  return null;
}

function isPreformattedRegion(parts: string[]): boolean {
  if (parts.length < 2) {
    return false;
  }

  const [shortSido, unit] = parts;

  if (!SHORT_SIDO.has(shortSido)) {
    return false;
  }

  return (
    unit.endsWith("구") ||
    isCityToken(unit) ||
    unit.endsWith("군") ||
    unit.endsWith("읍") ||
    unit.endsWith("면")
  );
}

/**
 * Derives a short region/location label from a Korean address string.
 * Returns an empty string when the address is missing or cannot be parsed
 * (callers may omit the label instead of showing a fallback).
 */
export function formatRegionLabel(address?: string | null): string {
  const trimmed = address?.trim();

  if (!trimmed || UNKNOWN_LOCATION_VALUES.has(trimmed)) {
    return "";
  }

  const parts = trimmed.split(/\s+/);

  if (isPreformattedRegion(parts)) {
    return `${parts[0]} ${parts[1]}`;
  }

  const sido = parts[0];
  const shortSido = abbreviateSido(sido);
  const strategy = getRegionStrategy(sido);

  let unit: string | null = null;

  switch (strategy) {
    case "metro":
      unit = findDistrict(parts);
      break;
    case "sejong":
      unit = findSejongUnit(parts);
      break;
    case "jeju":
      unit = findCity(parts);
      break;
    case "province":
      unit = findCityOrCounty(parts);
      break;
  }

  if (!unit) {
    return shortSido !== sido ? shortSido : trimmed;
  }

  return `${shortSido} ${unit}`;
}
