import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
      };
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: number;
    };
  }
}