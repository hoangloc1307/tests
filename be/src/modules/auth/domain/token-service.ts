/** Claims carried by issued tokens. */
export interface TokenPayload {
  username: string;
}

/**
 * Token service port. Abstracts token issuing/verification so the application
 * layer never imports `jsonwebtoken` directly.
 */
export interface TokenService {
  signAccessToken(payload: TokenPayload): string;
  signRefreshToken(payload: TokenPayload): string;
  verifyRefreshToken(token: string): TokenPayload;
}
