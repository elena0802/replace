import { supabase } from "@/lib/supabase/client";
import type { PlaceRow } from "@/types/database";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function getPlaceById(id: string): Promise<PlaceRow | null> {
  if (!uuidPattern.test(id)) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("places")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }

      throw new Error(
        `Supabase place select failed: ${error.message} (${error.code ?? "no-code"})`,
      );
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Supabase place select failed with an unknown error.");
  }
}
