export type DBUser = {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface User {
  id: number;
  username: string;
  email: string;
  createdAt?: number;
  lastLogin?: number;
}