// JSON encoded metrics
export interface DBPurchasesMetric {
  timestamp: string;
  server_id: number;
  purchases: string;
}

export interface DBPerformanceMetric {
  timestamp: string;
  server_id: number;
  performance: string;
}

export interface DBSocialMetric {
  timestamp: string;
  server_id: number;
  social: string;
}

export interface DBPlayersMetric {
  timestamp: string;
  server_id: number;
  players: string;
}

export interface DBMetadataMetric {
  timestamp: string;
  server_id: number;
  metadata: string;
}

export interface DBMetric {
  timestamp: string;
  server_id: number;
  purchases: string;
  performance: string;
  social: string;
  players: string;
  metadata: string;
}

// Raw data
export interface Purchases {
  passes: number;
  developer_products: number;
  subscriptions: number;
}

export interface Performance {
  memory: number;
  data_send: number;
  physics_step: number;
  fps: number;
  physics_send: number;
  physics_receive: number;
  instances: number;
  moving_primitives: number;
  heartbeat: number;
  primitives: number;
  data_receive: number;
}

export interface Social {
  friends_playing: number;
  chats: number;
}

export interface Players {
  active: number;
  new: number;
  returning: number;
  premium: number;
  average_session_duration: number;
  demographics: {
    regions: {
      [k: string]: unknown;
    };
    average_account_age: number;
  };
}

export interface Metadata {
  uptime: number;
  timestamp: number;
  creator: {
    id: string;
    type: string;
  };
  place: {
    id: string;
    name: string;
    version: number;
  };
  experience: {
    id: string;
    name: string;
  };
  server: {
    id: string;
    type: string;
    size: number;
  };
  geo: {
    user_agent?: {
      comment?: string;
      product?: string;
      raw_value?: string;
    };
    hostname?: string;
    longitude?: number;
    asn_org?: string;
    country?: string;
    time_zone?: string;
    ip_decimal?: number;
    metro_code?: number;
    ip?: string;
    asn?: string;
    latitude?: number;
    city?: string;
    zip_code?: string;
    region_name?: string;
    country_eu?: boolean;
    region_code?: string;
    country_iso?: string;
  };
}

// Parsed metrics
export interface PurchasesMetric {
  timestamp: string;
  server_id: number;
  purchases: Purchases;
}

export interface PerformanceMetric {
  timestamp: string;
  server_id: number;
  performance: Performance;
}

export interface SocialMetric {
  timestamp: string;
  server_id: number;
  social: Social;
}

export interface PlayersMetric {
  timestamp: string;
  server_id: number;
  players: Players;
}

export interface MetadataMetric {
  timestamp: string;
  server_id: number;
  metadata: Metadata;
}

export interface Metric {
  timestamp: string;
  server_id: number;
  purchases: Purchases;
  performance: Performance;
  social: Social;
  players: Players;
  metadata: Metadata;
}
