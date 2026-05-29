import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

export async function getSessionUser(timeoutMs = 2500): Promise<User | null> {
  try {
    const timeout = new Promise<null>((resolve) => {
      window.setTimeout(() => resolve(null), timeoutMs);
    });

    const sessionUser = supabase.auth
      .getSession()
      .then(({ data }) => data.session?.user ?? null);

    return await Promise.race([sessionUser, timeout]);
  } catch (error) {
    console.error(error);
    return null;
  }
}
