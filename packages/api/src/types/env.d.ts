import { LoggerSeverity } from "./logging";

export type NodeEnvironment = "development" | "production" | "test";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: NodeEnvironment;
      LOG_LEVEL: LoggerSeverity = "warn";
      SESSION_SECRET: string;
      JWT_API_KEY_SECRET: string;
      EXPERIENCE_STALE_TIME: number = 60000;
      PLACE_STALE_TIME: number = 60000;
      METRIC_MAX_AGE: number = 259200000;
      METRIC_CLEANUP_CRON: string = "0 0 * * *";
    }
  }
}