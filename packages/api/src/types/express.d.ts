import 'express';
import { RequestUser, SessionUser } from './auth';

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    user?: SessionUser
  }
}