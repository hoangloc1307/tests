import type { ChangePasswordInput } from 'shared/schemas/auth';
import { AppError } from '~/shared/domain/app-error';
import type { PasswordHasher } from '~/modules/auth/domain/password-hasher';
import type { UserRepository } from '~/modules/auth/domain/user.repository';

/**
 * Change-password use case for an authenticated user.
 */
export class ChangePasswordUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
  ) {}

  async execute(username: string, input: ChangePasswordInput): Promise<void> {
    const user = await this.users.findByUsername(username);
    if (!user) {
      throw AppError.notFound('auth:unauthorized');
    }

    const currentMatches = await this.hasher.verify(user.passwordHash, input.currentPassword);
    if (!currentMatches) {
      throw AppError.badRequest('auth:currentPasswordIncorrect');
    }

    const newHash = await this.hasher.hash(input.newPassword);
    await this.users.updatePasswordHash(username, newHash);
  }
}
