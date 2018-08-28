import { UserStatuses } from './enums';

export interface IApp {
  id?: number;
  user_id: number;
  client_id: string;
  client_secret: string;
  refresh_token?: boolean;
  scope?: string;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface IToken {
  id?: number;
  client_id: number;
  token_id: string;
  refresh_token: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface IAccount {
  id?: number;
  address: string;
  key: string;
  client_id: string;
  created_at?: Date;
  updated_at?: Date;
}


export interface IUser {
  id: number;
  name: string;
  email: string;
  email_verified: boolean;
  auth_provider: string;
  password: string;
  reset_password_token?: string;
  reset_password_attempts?: number;
  status?: UserStatuses;
  created_at: Date;
  updated_at: Date;
  isMaxPasswordResetAttemptReached?(attempts?: number): boolean;
}

export interface IKey {
  id?: number;
  client_id: string;
  encrypted_key: string;
  user_id: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface IWallet {
  id?: number;
  client_id: string;
  user_id: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface IWalletAddress {
  id?: number;
  chain: string;
  address: string;
  name: string;
  wallet_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface IWalletUser {
  id?: number;
  client_id: string;
  user_id: string;
  wallet_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface IActivityLog {
  id?: number;
  client_id: string;
  log: string;
  data: string;
  event_type: string;
  user_id: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface IDevice {
  id?: number;
  client_id: string;
  UUID: string;
  user_id: string;
  created_at?: Date;
  updated_at?: Date;
}