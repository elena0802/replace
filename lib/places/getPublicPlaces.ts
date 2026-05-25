import { supabase } from "@/lib/supabase/client";
import type { PlaceRow } from "@/types/database";

export async function getPublicPlaces(): Promise<PlaceRow[]> {
  try {
    const { data, error } = await supabase
      .from("places")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(
        `Supabase public places select failed: ${error.message} (${error.code ?? "no-code"})`,
      );
    }

    return data ?? [];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Supabase public places select failed with an unknown error.");
  }
}
