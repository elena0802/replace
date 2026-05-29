import { NextRequest, NextResponse } from "next/server";

const openAIResponsesUrl = "https://api.openai.com/v1/responses";
const defaultModel = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
const fallbackErrorMessage =
  "지금은 기록을 다듬지 못했어요. 잠시 후 다시 시도해주세요.";
const inputRequiredMessage = "장소명과 한 줄 기록을 먼저 입력해주세요.";
const shortMemoMessage =
  "조금만 더 적어주시면 자연스럽게 다듬을 수 있어요.";
const minimumMemoLength = 5;
const maximumMemoLength = 500;
const maximumPlaceNameLength = 120;
const maximumCategoryLength = 80;

const systemPrompt = [
  "너는 Re:Place의 기록 도우미다.",
  "Re:Place는 장소 정보보다 사용자의 기억과 순간을 기록하는 서비스다.",
  "",
  "좋은 장소를 평가하지 않는다.",
  "장소를 리뷰하지 않는다.",
  "리뷰처럼 쓰지 않는다.",
  "광고처럼 쓰지 않는다.",
  "주소를 설명하지 않는다.",
  "위치 정보를 소개하지 않는다.",
  "",
  "사용자의 감정, 분위기, 경험을 중심으로 작성한다.",
  "사용자가 남긴 기억을 짧고 따뜻한 기록으로 정리한다.",
  "마치 일기나 짧은 회고처럼 작성한다.",
  "",
  "2~4문장으로 작성한다.",
  "담백하고 따뜻하게 쓴다.",
  "",
  "사용자가 제공하지 않은 사실은 만들지 않는다.",
  "사용자가 제공하지 않은 장소 특징은 만들지 않는다.",
  "",
  "‘인근’, ‘위치한’, ‘명소’, ‘추천’, ‘최고’, ‘강력 추천’, ‘무조건 가봐야 한다’ 같은 표현은 사용하지 않는다.",
  "",
  "부모님 세대가 카카오톡으로 공유해도 자연스럽게 읽히는 문체를 사용한다.",
].join("\n");

export const dynamic = "force-dynamic";

type RecordHelperRequestBody = {
  address?: unknown;
  category?: unknown;
  memo?: unknown;
  placeName?: unknown;
};

function getText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getLimitedText(value: unknown, maximumLength: number) {
  return getText(value).slice(0, maximumLength);
}

function getRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

function createUserPrompt({
  category,
  memo,
  placeName,
}: {
  category: string;
  memo: string;
  placeName: string;
}) {
  return [
    "장소명(기억을 정리하기 위한 참고 정보):",
    placeName,
    "카테고리(필요할 때만 참고):",
    category || "제공되지 않음",
    "사용자 메모:",
    memo,
    "",
    "이 정보를 바탕으로 사용자의 기억과 순간을 2~4문장의 한국어 기록으로 작성해줘.",
    "중요:",
    "- 주소를 설명하지 않기",
    "- 위치 정보를 소개하지 않기",
    "- 리뷰처럼 평가하지 않기",
    "- 장소 소개문처럼 쓰지 않기",
    "- 과장하지 않기",
    "- 광고 문구처럼 쓰지 않기",
    "- ‘인근’, ‘위치한’, ‘명소’, ‘추천’ 같은 표현 사용 금지",
    "- 사용자의 감정, 분위기, 경험 중심으로 작성",
    "- 마치 일기나 짧은 회고처럼 작성",
    "- 따뜻하고 담백하게",
    "- 부모님 세대가 카카오톡에 공유해도 자연스러운 문장",
    "- 사용자가 쓴 내용을 바탕으로만 작성",
    "- 없는 장소 특징이나 사실 지어내지 않기",
    "- 한국어로 작성",
    "- 900자 이하",
    "- 이모지 사용 금지",
    "- 해시태그 사용 금지",
  ].join("\n");
}

function normalizeSuggestion(value: string) {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 900);
}

function extractTextFromContent(content: unknown): string[] {
  if (!Array.isArray(content)) {
    return [];
  }

  return content
    .map((item) => {
      const itemRecord = getRecord(item);
      const text = itemRecord?.text;

      return typeof text === "string" ? text : "";
    })
    .filter(Boolean);
}

function extractSuggestion(data: unknown) {
  const responseRecord = getRecord(data);

  if (!responseRecord) {
    return "";
  }

  if (typeof responseRecord.output_text === "string") {
    return normalizeSuggestion(responseRecord.output_text);
  }

  const output = responseRecord.output;

  if (!Array.isArray(output)) {
    return "";
  }

  const textParts = output.flatMap((item) => {
    const itemRecord = getRecord(item);

    return itemRecord ? extractTextFromContent(itemRecord.content) : [];
  });

  return normalizeSuggestion(textParts.join("\n"));
}

export async function POST(request: NextRequest) {
  let body: RecordHelperRequestBody;

  try {
    body = (await request.json()) as RecordHelperRequestBody;
  } catch {
    return NextResponse.json({ error: inputRequiredMessage }, { status: 400 });
  }

  const placeName = getLimitedText(body.placeName, maximumPlaceNameLength);
  const memo = getLimitedText(body.memo, maximumMemoLength);
  const category = getLimitedText(body.category, maximumCategoryLength);

  if (!placeName || !memo) {
    return NextResponse.json({ error: inputRequiredMessage }, { status: 400 });
  }

  if (memo.length < minimumMemoLength) {
    return NextResponse.json({ error: shortMemoMessage }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error("[AI Record Helper]", {
      reason: "OPENAI_API_KEY is not configured.",
    });

    return NextResponse.json(
      { error: fallbackErrorMessage },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(openAIResponsesUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: [
          {
            content: [
              {
                text: createUserPrompt({
                  category,
                  memo,
                  placeName,
                }),
                type: "input_text",
              },
            ],
            role: "user",
          },
        ],
        instructions: systemPrompt,
        max_output_tokens: 240,
        model: defaultModel,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("[AI Record Helper]", {
        body: errorBody,
        status: response.status,
      });

      return NextResponse.json(
        { error: fallbackErrorMessage },
        { status: 502 },
      );
    }

    const data = await response.json();
    const suggestion = extractSuggestion(data);

    if (!suggestion) {
      console.error("[AI Record Helper]", {
        reason: "OpenAI returned an empty suggestion.",
      });

      return NextResponse.json(
        { error: fallbackErrorMessage },
        { status: 502 },
      );
    }

    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error("[AI Record Helper]", {
      error,
      reason: "OpenAI request failed.",
    });

    return NextResponse.json(
      { error: fallbackErrorMessage },
      { status: 502 },
    );
  }
}
