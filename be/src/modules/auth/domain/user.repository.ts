import type { User } from '~/modules/auth/domain/user.entity';

export interface UserRepository {
  findByUsername(username: string): Promise<User | null>;
  updatePasswordHash(username: string, passwordHash: string): Promise<void>;
}
