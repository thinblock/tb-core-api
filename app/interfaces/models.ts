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

export interface IUser {
  id: number;
  name: string;
  email: string;
  email_verified: boolean;
  auth_provider: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}