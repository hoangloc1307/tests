import type { User } from '~/modules/auth/domain/user.entity';

/**
 * Repository port (interface) — defined by the domain, implemented by infrastructure.
 *
 * This is the inversion that makes it Clean Architecture: the use cases depend on
 * this abstraction, and the concrete data source (in-memory, Prisma, etc.) depends
 * on the domain by implementing it. Dependencies point inward.
 */
export interface UserRepository {
  findByUsername(username: string): Promise<User | null>;
  updatePasswordHash(username: string, passwordHash: string): Promise<void>;
}
