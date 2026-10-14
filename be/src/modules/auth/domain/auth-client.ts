import type { LoginInput } from 'shared/schemas/auth';

export interface AuthAccount {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string | null;
  isFirstTimeLogin: boolean;
  isHRReference: boolean;
  status: number;
  type: number;
}

export interface AuthClient {
  login(input: LoginInput): Promise<AuthAccount>;
}
