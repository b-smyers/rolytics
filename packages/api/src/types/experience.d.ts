export interface DBExperience {
  experience_id: number;
  roblox_experience_id: string;
  user_id: number;
  name: string;
  description: string;
  page_link: string;
  thumbnail_link: string;
  created_at: string;
  purchases: string;
  performance: string;
  social: string;
  players: string;
  metadata: string;
  last_computed_at: string;
}

export type Experience = DBExperience;
