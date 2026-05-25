import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

export class AuthRequiredError extends Error {
  constructor(message = "로그인이 필요합니다.") {
    super(message);
    this.name = "AuthRequiredError";
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      return null;
    }

    return data.user;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function requireCurrentUser(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthRequiredError();
  }

  return user;
}
