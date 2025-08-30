export interface SessionUser {
  id?: number;
  username?: string;
}

export type RequestUser = SessionUser;

// === /auth/login ===
export interface LoginBody {
  username: string;
  password: string;
}

// === /auth/register ===
export interface RegisterBody {
  username: string;
  password: string;
  email: string;
}

// === /auth/logout ===
export type LogoutBody = {};

// === /auth/verify ===
export interface VerifyBody {
  message: string;
}
