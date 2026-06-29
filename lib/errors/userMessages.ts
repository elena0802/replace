type LoadContext =
  | "myPlaces"
  | "publicPlaces"
  | "savedPlaces"
  | "collections"
  | "publicCollections"
  | "placeDetail"
  | "collectionDetail";

const TECHNICAL_MESSAGE_PATTERN =
  /supabase|pgrst|mvp\b|authrequirederror|payment_not_found|database|exception|failed to search|search query|naver api|toss payments|client key|rls policy|\/api\//i;

const ERROR_CODE_PATTERN = /^[A-Z][A-Z0-9_]*$/;

export const userMessages = {
  tryAgain: "잠시 후 다시 시도해주세요.",
  loadMyPlacesFailed:
    "장소 기록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
  loadPublicPlacesFailed:
    "공개 장소를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
  loadSavedPlacesFailed:
    "저장한 장소를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
  loadCollectionsFailed:
    "컬렉션을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
  loadPublicCollectionsFailed:
    "공개 컬렉션을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
  loadPlaceDetailFailed:
    "장소 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
  loadCollectionDetailFailed:
    "컬렉션을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
  savePlaceFailed: "기록을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.",
  updatePlaceFailed:
    "장소 기록을 수정하지 못했습니다. 잠시 후 다시 시도해주세요.",
  deletePlaceFailed:
    "장소 기록을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.",
  uploadImageFailed: "사진을 업로드하지 못했습니다. 다시 시도해주세요.",
  serviceUnavailable:
    "지금은 요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.",
  collectionUnavailable:
    "지금은 컬렉션을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
  saveUnavailable:
    "지금은 저장 기능을 사용할 수 없습니다. 잠시 후 다시 시도해주세요.",
  naverSearchRequired: "검색어를 입력해주세요.",
  naverSearchFailed:
    "장소 검색에 실패했어요. 잠시 후 다시 시도해주세요.",
  paymentPrepareFailed:
    "결제를 준비하지 못했습니다. 잠시 후 다시 시도해주세요.",
  paymentConfirmFailed:
    "결제를 확인하지 못했습니다. 잠시 후 다시 시도해주세요.",
  paymentWidgetLoadFailed:
    "결제 화면을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
  paymentFailDefault:
    "결제가 취소되었거나 승인되지 않았습니다. 잠시 후 다시 시도해주세요.",
  paymentMissingInfo: "결제 승인에 필요한 정보가 부족합니다.",
  paymentWidgetNotReady: "결제 화면이 아직 준비되지 않았습니다.",
} as const;

function containsHangul(value: string) {
  return /[가-힣]/.test(value);
}

export function isHumanKoreanMessage(message: string) {
  const trimmed = message.trim();

  if (!trimmed) {
    return false;
  }

  if (ERROR_CODE_PATTERN.test(trimmed)) {
    return false;
  }

  if (TECHNICAL_MESSAGE_PATTERN.test(trimmed)) {
    return false;
  }

  return containsHangul(trimmed);
}

export function mapSupabaseError(
  error?: unknown,
  context: LoadContext = "publicPlaces",
) {
  console.error(error);

  switch (context) {
    case "myPlaces":
      return userMessages.loadMyPlacesFailed;
    case "savedPlaces":
      return userMessages.loadSavedPlacesFailed;
    case "collections":
      return userMessages.loadCollectionsFailed;
    case "publicCollections":
      return userMessages.loadPublicCollectionsFailed;
    case "placeDetail":
      return userMessages.loadPlaceDetailFailed;
    case "collectionDetail":
      return userMessages.loadCollectionDetailFailed;
    case "publicPlaces":
    default:
      return userMessages.loadPublicPlacesFailed;
  }
}

export function mapPaymentError(message?: string | null, code?: string | null) {
  if (code) {
    console.error("Payment error code:", code);
  }

  if (message && isHumanKoreanMessage(message)) {
    return message;
  }

  if (message) {
    console.error("Payment error message:", message);
  }

  return userMessages.paymentConfirmFailed;
}

export function mapPaymentPrepareError(message?: string | null) {
  if (message && isHumanKoreanMessage(message)) {
    return message;
  }

  if (message) {
    console.error("Payment prepare error:", message);
  }

  return userMessages.paymentPrepareFailed;
}

export function mapPaymentFailMessage(message?: string | null) {
  if (message && isHumanKoreanMessage(message)) {
    return message;
  }

  if (message) {
    console.error("Payment fail message:", message);
  }

  return userMessages.paymentFailDefault;
}

export function mapNaverError(error?: string | null) {
  if (error === "Search query is required.") {
    return userMessages.naverSearchRequired;
  }

  if (error && isHumanKoreanMessage(error)) {
    return error;
  }

  if (error) {
    console.error("Naver search error:", error);
  }

  return userMessages.naverSearchFailed;
}

export function mapGenericError(
  error?: unknown,
  fallback: string = userMessages.tryAgain,
) {
  if (error instanceof Error && isHumanKoreanMessage(error.message)) {
    return error.message;
  }

  console.error(error);
  return fallback;
}
