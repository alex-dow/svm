import { Insertable, Selectable, Updateable } from "kysely";

export interface AccountTable {
  accessToken: string | null;
  accessTokenExpiresAt: string | null;
  accountId: string;
  createdAt: string;
  id: string;
  idToken: string | null;
  password: string | null;
  providerId: string;
  refreshToken: string | null;
  refreshTokenExpiresAt: string | null;
  scope: string | null;
  updatedAt: string;
  userId: string;
}

export type Account = Selectable<AccountTable>
export type CreateAccount = Insertable<AccountTable>;
export type UpdateAccount = Updateable<AccountTable>;

export interface SessionTable {
  createdAt: string;
  expiresAt: string;
  id: string;
  ipAddress: string | null;
  token: string;
  updatedAt: string;
  userAgent: string | null;
  userId: string;
}

export type Session = Selectable<SessionTable>
export type CreateSession = Insertable<SessionTable>
export type UpdateSession = Updateable<SessionTable>

export interface UserTable {
  createdAt: string;
  email: string;
  emailVerified: number;
  id: string;
  image: string | null;
  name: string;
  username: string;
  displayUsername: string | null;
  updatedAt: string;
}

export type User = Selectable<UserTable>
export type CreateUser = Insertable<UserTable>
export type UpdateUser = Updateable<UserTable>

export interface VerificationTable {
  createdAt: string | null;
  expiresAt: string;
  id: string;
  identifier: string;
  updatedAt: string | null;
  value: string;
}

export type Verification = Selectable<VerificationTable>
export type CreateVerification = Insertable<VerificationTable>
export type UpdateVerification = Updateable<VerificationTable>