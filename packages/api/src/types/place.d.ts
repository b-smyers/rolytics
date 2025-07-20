export interface DBPlace {
  place_id: number;
  roblox_place_id: string;
  experience_id: number;
  name: string;
  purchases: string;
  performance: string;
  social: string;
  players: string;
  metadata: string;
  last_computed_at: number;
}

export type Place = DBPlace; 