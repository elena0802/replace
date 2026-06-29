import { NextRequest, NextResponse } from "next/server";
import { userMessages } from "@/lib/errors/userMessages";

const naverLocalSearchUrl = "https://openapi.naver.com/v1/search/local.json";
const defaultDisplay = 5;
const maxDisplay = 10;
const minQueryLength = 2;

type NaverLocalSearchItem = {
  title?: string;
  link?: string;
  category?: string;
  address?: string;
  roadAddress?: string;
  mapx?: string | number;
  mapy?: string | number;
};

type NaverLocalSearchResponse = {
  items?: NaverLocalSearchItem[];
};

type NormalizedPlaceSearchResult = {
  id: string;
  name: string;
  category: string;
  address: string;
  roadAddress: string;
  mapUrl: string;
  latitude: number | null;
  longitude: number | null;
};

export const dynamic = "force-dynamic";

function getDisplay(value: string | null) {
  const parsedDisplay = Number(value);

  if (!Number.isInteger(parsedDisplay) || parsedDisplay < 1) {
    return defaultDisplay;
  }

  return Math.min(parsedDisplay, maxDisplay);
}

function decodeHtmlEntities(value: string) {
  const entities: Record<string, string> = {
    amp: "&",
    quot: "\"",
    apos: "'",
    lt: "<",
    gt: ">",
    nbsp: " ",
  };

  return value
    .replace(/&([a-z]+);/gi, (match, entity: string) => {
      return entities[entity.toLowerCase()] ?? match;
    })
    .replace(/&#(\d+);/g, (match, code: string) => {
      const parsedCode = Number(code);
      return Number.isFinite(parsedCode) ? String.fromCharCode(parsedCode) : match;
    })
    .replace(/&#x([\da-f]+);/gi, (match, code: string) => {
      const parsedCode = Number.parseInt(code, 16);
      return Number.isFinite(parsedCode) ? String.fromCharCode(parsedCode) : match;
    });
}

function stripHtml(value: string | undefined) {
  return decodeHtmlEntities(value ?? "")
    .replace(/<[^>]*>/g, "")
    .trim();
}

function parseCoordinate(
  value: string | number | undefined,
  min: number,
  max: number,
) {
  if (value === undefined || value === "") {
    return null;
  }

  const coordinate = Number(value);

  if (!Number.isFinite(coordinate)) {
    return null;
  }

  if (coordinate >= min && coordinate <= max) {
    return coordinate;
  }

  const scaledCoordinate = coordinate / 10_000_000;

  return scaledCoordinate >= min && scaledCoordinate <= max
    ? scaledCoordinate
    : null;
}

function createNaverMapSearchUrl(name: string) {
  const mapSearchQuery = encodeURIComponent(name);

  return `https://map.naver.com/p/search/${mapSearchQuery}`;
}

function normalizeSearchItem(
  item: NaverLocalSearchItem,
  index: number,
): NormalizedPlaceSearchResult {
  const name = stripHtml(item.title);
  const category = stripHtml(item.category);
  const address = stripHtml(item.address);
  const roadAddress = stripHtml(item.roadAddress);
  const mapUrl = createNaverMapSearchUrl(name);
  const longitude = parseCoordinate(item.mapx, -180, 180);
  const latitude = parseCoordinate(item.mapy, -90, 90);
  const idBase = `${name}-${roadAddress || address}-${item.mapx ?? ""}-${item.mapy ?? ""}`;

  return {
    id: idBase || `naver-place-${index}`,
    name,
    category,
    address,
    roadAddress,
    mapUrl,
    latitude,
    longitude,
  };
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const query = requestUrl.searchParams.get("q")?.trim() ?? "";
  const display = getDisplay(requestUrl.searchParams.get("display"));

  if (!query) {
    return NextResponse.json(
      { error: userMessages.naverSearchRequired },
      { status: 400 },
    );
  }

  if (query.length < minQueryLength) {
    return NextResponse.json({ results: [] });
  }

  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: userMessages.serviceUnavailable },
      { status: 500 },
    );
  }

  const naverUrl = new URL(naverLocalSearchUrl);
  naverUrl.searchParams.set("query", query);
  naverUrl.searchParams.set("display", String(display));

  try {
    const response = await fetch(naverUrl, {
      headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Naver local search failed:", {
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
      });

      return NextResponse.json(
        { error: userMessages.naverSearchFailed },
        { status: 500 },
      );
    }

    const data = (await response.json()) as NaverLocalSearchResponse;
    const results = (data.items ?? []).map(normalizeSearchItem);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Naver local search request failed:", error);

    return NextResponse.json(
      { error: userMessages.naverSearchFailed },
      { status: 500 },
    );
  }
}
