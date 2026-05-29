import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type CookieToSet = Parameters<
  NonNullable<CookieMethodsServer["setAll"]>
>[0][number];

export function createSupabaseRouteClient(request: NextRequest) {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  const cookiesToSet: CookieToSet[] = [];
  const headersToSet = new Headers();

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(nextCookies, headers) {
        cookiesToSet.push(...nextCookies);
        Object.entries(headers).forEach(([key, value]) => {
          headersToSet.set(key, value);
        });
      },
    },
  });

  function withAuthCookies(response: NextResponse) {
    cookiesToSet.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });

    headersToSet.forEach((value, key) => {
      response.headers.set(key, value);
    });

    return response;
  }

  return {
    supabase,
    withAuthCookies,
  };
}

export function jsonWithAuthCookies(
  routeClient: ReturnType<typeof createSupabaseRouteClient>,
  body: unknown,
  init?: ResponseInit,
) {
  return routeClient.withAuthCookies(NextResponse.json(body, init));
}
