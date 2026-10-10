/**
 * Password hasher port. The domain declares *what* it needs (hash / verify)
 * without caring that the implementation happens to use argon2.
 */
export interface PasswordHasher {
  hash(plain: string): Promise<string>;
  verify(hash: string, plain: string): Promise<boolean>;
}
