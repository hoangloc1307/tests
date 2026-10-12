export interface TokenPayload {
  username: string;
}

export interface TokenService {
  signAccessToken(payload: TokenPayload): string;
  verifyAccessToken(token: string): TokenPayload;
  signRefreshToken(payload: TokenPayload): string;
  verifyRefreshToken(token: string): TokenPayload;
}
