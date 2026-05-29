import { supabase } from "@/lib/supabase/client";
import type { CollectionRow } from "@/types/database";

export type CollectionListItem = CollectionRow & {
  placeCount: number;
};

type CollectionQueryRow = CollectionRow & {
  collection_places: { count: number }[];
};

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

  return rows.map((row) => ({
    id: row.id,
    user_id: row.user_id,
    name: row.name,
    description: row.description,
    created_at: row.created_at,
    placeCount: row.collection_places[0]?.count ?? 0,
  }));
}
