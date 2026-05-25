import { supabase } from "@/lib/supabase/client";
import { requireCurrentUser } from "@/lib/auth/getCurrentUser";

export async function deletePlace(id: string): Promise<void> {
  try {
    await requireCurrentUser();

    const { error } = await supabase
      .from("places")
      .delete()
      .eq("id", id)
      .select("id")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error(
          "Supabase place delete failed: no row was deleted. Check the place id and MVP delete RLS policy.",
        );
      }

      throw new Error(
        `Supabase place delete failed: ${error.message} (${error.code ?? "no-code"})`,
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Supabase place delete failed with an unknown error.");
  }
}
