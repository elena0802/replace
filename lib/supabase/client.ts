import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const missingConfigMessage =
  "Supabase 환경변수가 설정되지 않았습니다. .env.local에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 추가해주세요.";

let browserClient: SupabaseClient<Database> | null = null;

export function getSupabaseEnvironmentStatus() {
  return {
    configured: Boolean(supabaseUrl && supabaseAnonKey),
    missingKeys: [
      !supabaseUrl && "NEXT_PUBLIC_SUPABASE_URL",
      !supabaseAnonKey && "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ].filter(Boolean) as string[],
  };
}

export function getSupabaseConfig() {
  const status = getSupabaseEnvironmentStatus();

  if (!status.configured) {
    throw new Error(
      `${missingConfigMessage} 누락된 값: ${status.missingKeys.join(", ")}`,
    );
  }

  return {
    supabaseUrl: supabaseUrl!,
    supabaseAnonKey: supabaseAnonKey!,
  };
}

function createBrowserSupabaseClient() {
  const config = getSupabaseConfig();

  browserClient ??= createBrowserClient<Database>(
    config.supabaseUrl,
    config.supabaseAnonKey,
  );
  return browserClient;
}

export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_target, property, receiver) {
    const client = createBrowserSupabaseClient();
    const value = Reflect.get(client, property, receiver);

    return typeof value === "function" ? value.bind(client) : value;
  },
});
