import { User } from '~/modules/auth/domain/user.entity';
import type { PasswordHasher } from '~/modules/auth/domain/password-hasher';
import type { UserRepository } from '~/modules/auth/domain/user.repository';

/**
 * In-memory implementation of the UserRepository port.
 *
 * base_ts has no database wired up yet, so this adapter keeps the feature
 * runnable end-to-end. Because the use cases depend on the port and not on this
 * class, replacing it with a Prisma-backed adapter later is a one-line change in
 * the composition root — no use case or domain code has to be touched.
 */
export class InMemoryUserRepository implements UserRepository {
  private readonly store = new Map<string, User>();

  async findByUsername(username: string): Promise<User | null> {
    return this.store.get(username) ?? null;
  }

  async updatePasswordHash(username: string, passwordHash: string): Promise<void> {
    const existing = this.store.get(username);
    if (!existing) return;
    this.store.set(
      username,
      new User({
        username: existing.username,
        name: existing.name,
        email: existing.email,
        passwordHash,
        isActive: existing.isActive,
      }),
    );
  }

  /** Seed a demo account so login can be exercised without a database. */
  static async seeded(hasher: PasswordHasher): Promise<InMemoryUserRepository> {
    const repo = new InMemoryUserRepository();
    const passwordHash = await hasher.hash('password');
    repo.store.set(
      'demouser',
      new User({
        username: 'demouser',
        name: 'Demo User',
        email: 'demo@example.com',
        passwordHash,
        isActive: true,
      }),
    );
    return repo;
  }
}
