export type PlaceRow = {
  id: string;
  user_id: string | null;
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
  naver_place_id: string | null;
  road_address: string | null;
  map_url: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
};

export type PlaceInsert = {
  id?: string;
  user_id: string;
  name: string;
  category: string;
  region: string;
  memory: string;
  visited_date?: string | null;
  companion?: string | null;
  revisit_level?: string;
  space_tags?: string[];
  is_public?: boolean;
  image_url?: string | null;
  naver_place_id?: string | null;
  road_address?: string | null;
  map_url?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  created_at?: string;
  updated_at?: string;
};

export type PlaceUpdate = {
  id?: string;
  user_id?: string;
  name?: string;
  category?: string;
  region?: string;
  memory?: string;
  visited_date?: string | null;
  companion?: string | null;
  revisit_level?: string;
  space_tags?: string[];
  is_public?: boolean;
  image_url?: string | null;
  naver_place_id?: string | null;
  road_address?: string | null;
  map_url?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  created_at?: string;
  updated_at?: string;
};

export type PaymentRow = {
  id: string;
  user_id: string;
  order_id: string;
  payment_key: string | null;
  amount: number;
  status: string;
  plan: string;
  created_at: string;
  approved_at: string | null;
};

export type PaymentInsert = {
  id?: string;
  user_id: string;
  order_id: string;
  payment_key?: string | null;
  amount: number;
  status?: string;
  plan?: string;
  created_at?: string;
  approved_at?: string | null;
};

export type PaymentUpdate = {
  id?: string;
  user_id?: string;
  order_id?: string;
  payment_key?: string | null;
  amount?: number;
  status?: string;
  plan?: string;
  created_at?: string;
  approved_at?: string | null;
};

export type SavedPlaceRow = {
  id: string;
  user_id: string;
  place_id: string;
  created_at: string;
};

export type SavedPlaceInsert = {
  id?: string;
  user_id: string;
  place_id: string;
  created_at?: string;
};

export type SavedPlaceUpdate = {
  id?: string;
  user_id?: string;
  place_id?: string;
  created_at?: string;
};

export type CollectionRow = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
};

export type CollectionInsert = {
  id?: string;
  user_id: string;
  name: string;
  description?: string | null;
  is_public?: boolean;
  created_at?: string;
};

export type CollectionUpdate = {
  id?: string;
  user_id?: string;
  name?: string;
  description?: string | null;
  is_public?: boolean;
  created_at?: string;
};

export type CollectionPlaceRow = {
  id: string;
  collection_id: string;
  place_id: string;
  created_at: string;
};

export type CollectionPlaceInsert = {
  id?: string;
  collection_id: string;
  place_id: string;
  created_at?: string;
};

export type CollectionPlaceUpdate = {
  id?: string;
  collection_id?: string;
  place_id?: string;
  created_at?: string;
};

export interface Database {
  public: {
    Tables: {
      places: {
        Row: PlaceRow;
        Insert: PlaceInsert;
        Update: PlaceUpdate;
        Relationships: [];
      };
      payments: {
        Row: PaymentRow;
        Insert: PaymentInsert;
        Update: PaymentUpdate;
        Relationships: [];
      };
      saved_places: {
        Row: SavedPlaceRow;
        Insert: SavedPlaceInsert;
        Update: SavedPlaceUpdate;
        Relationships: [];
      };
      collections: {
        Row: CollectionRow;
        Insert: CollectionInsert;
        Update: CollectionUpdate;
        Relationships: [];
      };
      collection_places: {
        Row: CollectionPlaceRow;
        Insert: CollectionPlaceInsert;
        Update: CollectionPlaceUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
