import { supabase } from "@/lib/supabase/client";
import type { CollectionRow, PlaceRow } from "@/types/database";

export type CollectionPlaceListItem = {
  collectionPlaceId: string;
  addedAt: string;
  place: PlaceRow;
};

export type CollectionDetail = {
  collection: CollectionRow;
  places: CollectionPlaceListItem[];
};

type CollectionPlaceQueryRow = {
  id: string;
  created_at: string;
  places: PlaceRow | PlaceRow[] | null;
};

function normalizeJoinedPlace(place: CollectionPlaceQueryRow["places"]) {
  return Array.isArray(place) ? (place[0] ?? null) : place;
}

export async function getCollectionDetail(
  collectionId: string,
  userId: string,
): Promise<CollectionDetail | null> {
  const { data: collection, error: collectionError } = await supabase
    .from("collections")
    .select("*")
    .eq("id", collectionId)
    .eq("user_id", userId)
    .maybeSingle();

  if (collectionError) {
    throw new Error(
      `Supabase collection select failed: ${collectionError.message} (${collectionError.code ?? "no-code"})`,
    );
  }

  if (!collection) {
    return null;
  }

  const { data, error } = await supabase
    .from("collection_places")
    .select("id, created_at, places(*)")
    .eq("collection_id", collectionId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(
      `Supabase collection places select failed: ${error.message} (${error.code ?? "no-code"})`,
    );
  }

  const rows = (data ?? []) as unknown as CollectionPlaceQueryRow[];

  return {
    collection,
    places: rows.flatMap((row) => {
      const place = normalizeJoinedPlace(row.places);

      return place
        ? [
            {
              collectionPlaceId: row.id,
              addedAt: row.created_at,
              place,
            },
          ]
        : [];
    }),
  };
}
