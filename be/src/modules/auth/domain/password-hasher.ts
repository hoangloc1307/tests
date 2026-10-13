export interface PasswordVerifier {
  verify(hash: string, securityStamp: string, plain: string): boolean;
}
