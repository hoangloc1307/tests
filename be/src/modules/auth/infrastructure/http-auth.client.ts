import type { LoginInput } from 'shared/schemas/auth';
import { injectable } from 'tsyringe';
import type { AuthAccount, AuthClient } from '~/modules/auth/domain/auth-client';
import { AppError } from '~/shared/domain/app-error';
import { env } from '~/shared/infrastructure/env';

interface ExternalApiResponse {
  Data: {
    Account: {
      id: string;
      username: string;
      display_name: string;
      email: string;
      avatar: string | null;
      isFirstTimeLogin: boolean;
      isHRReference: boolean;
      status: number;
      type: number;
    };
    Token: {
      access_token: string;
      refresh_token: string;
    };
  };
  StatusCode: string;
  Message: string;
  Success: boolean;
}

@injectable()
export class HttpAuthClient implements AuthClient {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = env.AUTH_ENDPOINT;
  }

  async login(input: LoginInput): Promise<AuthAccount> {
    const response = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Username: input.username,
        Password: input.password,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw AppError.unauthorized('auth:invalidCredentials');
      }
      throw AppError.server('auth:loginFailed');
    }

    const data = (await response.json()) as ExternalApiResponse;

    if (!data.Success) {
      throw AppError.unauthorized('auth:invalidCredentials');
    }

    return {
      id: data.Data.Account.id,
      username: data.Data.Account.username,
      displayName: data.Data.Account.display_name,
      status: data.Data.Account.status,
      token: data.Data.Token.access_token,
    };
  }
}
