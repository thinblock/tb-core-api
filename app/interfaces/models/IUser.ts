export default interface IUser {
  name: string;
  email: string;
  email_verified: boolean;
  auth_provider: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}