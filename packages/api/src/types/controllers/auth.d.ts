export interface SessionUser {
  id?: number;
  username?: string;
}

export type RequestUser = SessionUser;

// === /auth/login ===
export interface LoginWithUsername {
  username: string;
  email?: never; // mutually exclusive
  password: string;
}

export interface LoginWithEmail {
  username?: never; // mutually exclusive
  email: string;
  password: string;
}

export type LoginBody = LoginWithUsername | LoginWithEmail;

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