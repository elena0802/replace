import { supabase } from "@/lib/supabase/client";
import type { PlaceRow, PlaceUpdate } from "@/types/database";

export async function updatePlace(
  id: string,
  place: PlaceUpdate,
): Promise<PlaceRow> {
  try {
    const { data, error } = await supabase
      .from("places")
      .update(place)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error(
          "Supabase place update failed: no row was updated. Check the place id and MVP update RLS policy.",
        );
      }

      throw new Error(
        `Supabase place update failed: ${error.message} (${error.code ?? "no-code"})`,
      );
    }

    if (!data) {
      throw new Error("Supabase place update succeeded but no row was returned.");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Supabase place update failed with an unknown error.");
  }
}
