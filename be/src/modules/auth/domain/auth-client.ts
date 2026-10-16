import type { LoginInput } from 'shared/schemas/auth';

export interface AuthAccount {
  id: string;
  username: string;
  displayName: string;
  status: number;
  token: string;
}

export interface AuthClient {
  login(input: LoginInput): Promise<AuthAccount>;
}
