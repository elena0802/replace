import { supabase } from "@/lib/supabase/client";
import { requireCurrentUser } from "@/lib/auth/getCurrentUser";
import type { PlaceInsert, PlaceRow } from "@/types/database";

export async function createPlace(
  place: Omit<PlaceInsert, "user_id">,
): Promise<PlaceRow> {
  try {
    const user = await requireCurrentUser();

    const { data, error } = await supabase
      .from("places")
      .insert([{ ...place, user_id: user.id }])
      .select()
      .single();

    if (error) {
      throw new Error(
        `Supabase places insert failed: ${error.message} (${error.code ?? "no-code"})`,
      );
    }

    if (!data) {
      throw new Error("Supabase places insert succeeded but no row was returned.");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Supabase places insert failed with an unknown error.");
  }
}
