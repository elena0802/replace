import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import {
  defaultLoginRedirectPath,
  getSafeAuthRedirectPath,
} from "@/lib/auth/redirect";
import { getSupabaseConfig } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

export const dynamic = "force-dynamic";

function getRedirectResponse(requestUrl: URL, path: string) {
  return NextResponse.redirect(new URL(path, requestUrl.origin));
}

function getLoginErrorResponse(requestUrl: URL, reason: string, nextPath: string) {
  const redirectUrl = new URL("/login", requestUrl.origin);
  redirectUrl.searchParams.set("error", reason);

  if (nextPath !== defaultLoginRedirectPath) {
    redirectUrl.searchParams.set("next", nextPath);
  }

  return NextResponse.redirect(redirectUrl);
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = getSafeAuthRedirectPath(requestUrl.searchParams.get("next"));

  if (!code) {
    return getLoginErrorResponse(requestUrl, "oauth_missing_code", nextPath);
  }

  let response = getRedirectResponse(requestUrl, nextPath);

  try {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
    const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });

          Object.entries(headers).forEach(([key, value]) => {
            response.headers.set(key, value);
          });
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Supabase OAuth callback failed:", error);
    response = getLoginErrorResponse(requestUrl, "oauth_callback", nextPath);
  }

  return response;
}
