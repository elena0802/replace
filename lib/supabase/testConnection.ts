import { getSupabaseEnvironmentStatus } from "@/lib/supabase/client";

export function getSupabaseConnectionStatus() {
  const status = getSupabaseEnvironmentStatus();

  if (!status.configured) {
    return {
      configured: false,
      message: `Supabase 환경변수가 아직 설정되지 않았습니다. 누락된 값: ${status.missingKeys.join(", ")}`,
    };
  }

  return {
    configured: true,
    message: "Supabase 환경변수가 설정되어 있습니다. 다음 단계에서 실제 연결과 테이블 조회를 추가할 수 있습니다.",
  };
}
