import { supabase } from "@/lib/supabase/client";
import type { PlaceRow } from "@/types/database";

export type SavedPlaceListItem = {
  savedPlaceId: string;
  savedAt: string;
  place: PlaceRow;
};

type SavedPlaceQueryRow = {
  id: string;
  created_at: string;
  places: PlaceRow | PlaceRow[] | null;
};

function normalizeJoinedPlace(place: SavedPlaceQueryRow["places"]) {
  return Array.isArray(place) ? (place[0] ?? null) : place;
}

export async function getSavedPlaces(
  userId: string,
): Promise<SavedPlaceListItem[]> {
  try {
    const { data, error } = await supabase
      .from("saved_places")
      .select("id, created_at, places(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(
        `Supabase saved places select failed: ${error.message} (${error.code ?? "no-code"})`,
      );
    }

    const rows = (data ?? []) as unknown as SavedPlaceQueryRow[];

    return rows.flatMap((row) => {
      const place = normalizeJoinedPlace(row.places);

      return place
        ? [
            {
              savedPlaceId: row.id,
              savedAt: row.created_at,
              place,
            },
          ]
        : [];
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Supabase saved places select failed with an unknown error.");
  }
}
