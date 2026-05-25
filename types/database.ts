export type PlaceRow = {
  id: string;
  name: string;
  category: string;
  region: string;
  memory: string;
  visited_date: string | null;
  companion: string | null;
  revisit_level: string;
  space_tags: string[];
  is_public: boolean;
  image_url: string | null;
  created_at: string;
};

export type PlaceInsert = Omit<PlaceRow, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

export type PlaceUpdate = Partial<PlaceInsert>;

export interface Database {
  public: {
    Tables: {
      places: {
        Row: PlaceRow;
        Insert: PlaceInsert;
        Update: PlaceUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
