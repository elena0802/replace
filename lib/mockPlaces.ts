export type Place = {
  id: string;
  name: string;
  category: "카페" | "음식점" | "공원" | "여행지" | "호텔";
  region: string;
  imageUrl: string;
  shortReview: string;
  revisitLevel: string;
  seniorTags: string[];
  isPublic: boolean;
};

export const mockPlaces: Place[] = [
  {
    id: "cafe-bomnal",
    name: "봄날 정원 카페",
    category: "카페",
    region: "경기 양평",
    imageUrl:
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1200&q=80",
    shortReview: "창가 자리가 편하고 커피가 부드러워 오래 쉬기 좋았어요.",
    revisitLevel: "꼭 다시 가고 싶어요",
    seniorTags: ["주차 편함", "조용함", "좌석 편함"],
    isPublic: true,
  },
  {
    id: "namu-table",
    name: "나무 밥상",
    category: "음식점",
    region: "서울 종로",
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    shortReview: "간이 세지 않고 반찬이 정갈해서 부모님과 가기 좋았어요.",
    revisitLevel: "다시 가고 싶어요",
    seniorTags: ["음식 담백함", "대화하기 좋음", "직원 친절"],
    isPublic: true,
  },
  {
    id: "haneul-park",
    name: "호숫가 산책공원",
    category: "공원",
    region: "경기 양평",
    imageUrl:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
    shortReview: "길이 평탄하고 벤치가 많아 천천히 걷기 좋았어요.",
    revisitLevel: "계절마다 가고 싶어요",
    seniorTags: ["걷기 좋음", "벤치 많음", "화장실 가까움"],
    isPublic: true,
  },
  {
    id: "gangneung-sea-trip",
    name: "강릉 바다길 여행",
    category: "여행지",
    region: "강원 강릉",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    shortReview: "바다를 보며 걷는 길이 넓고 쉬어갈 곳이 많았어요.",
    revisitLevel: "시간 내서 다시 가고 싶어요",
    seniorTags: ["경치 좋음", "산책 편함", "사진 찍기 좋음"],
    isPublic: true,
  },
  {
    id: "bada-rest-hotel",
    name: "바다쉼 호텔",
    category: "호텔",
    region: "부산 해운대",
    imageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    shortReview: "엘리베이터 이동이 편하고 아침 식사가 부담 없었어요.",
    revisitLevel: "기회가 되면 다시 가고 싶어요",
    seniorTags: ["이동 편함", "조식 좋음", "침구 편안함"],
    isPublic: false,
  },
];
