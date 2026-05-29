import { supabase } from "@/lib/supabase/client";
import type { CollectionRow } from "@/types/database";

export type CollectionListItem = CollectionRow & {
  placeCount: number;
  coverImageUrl: string | null;
};

type CollectionQueryRow = CollectionRow & {
  collection_places: { count: number }[];
};

type CollectionCoverQueryRow = {
  collection_id: string;
  created_at: string;
  places: { image_url: string | null } | { image_url: string | null }[] | null;
};

function normalizeJoinedCoverPlace(place: CollectionCoverQueryRow["places"]) {
  return Array.isArray(place) ? (place[0] ?? null) : place;
}

export async function getCollections(
  userId: string,
): Promise<CollectionListItem[]> {
  const { data, error } = await supabase
    .from("collections")
    .select("*, collection_places(count)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(
      `Supabase collections select failed: ${error.message} (${error.code ?? "no-code"})`,
    );
  }

  const rows = (data ?? []) as unknown as CollectionQueryRow[];
  const collectionIds = rows.map((row) => row.id);
  const coverImageByCollectionId = new Map<string, string | null>();

  if (collectionIds.length > 0) {
    const { data: coverData, error: coverError } = await supabase
      .from("collection_places")
      .select("collection_id, created_at, places(image_url)")
      .in("collection_id", collectionIds)
      .order("created_at", { ascending: false });

    if (coverError) {
      throw new Error(
        `Supabase collection cover select failed: ${coverError.message} (${coverError.code ?? "no-code"})`,
      );
    }

    const coverRows = (coverData ?? []) as unknown as CollectionCoverQueryRow[];

    coverRows.forEach((row) => {
      if (coverImageByCollectionId.has(row.collection_id)) {
        return;
      }

      coverImageByCollectionId.set(
        row.collection_id,
        normalizeJoinedCoverPlace(row.places)?.image_url ?? null,
      );
    });
  }

  return rows.map((row) => ({
    id: row.id,
    user_id: row.user_id,
    name: row.name,
    description: row.description,
    is_public: row.is_public,
    created_at: row.created_at,
    placeCount: row.collection_places[0]?.count ?? 0,
    coverImageUrl: coverImageByCollectionId.get(row.id) ?? null,
  }));
}
