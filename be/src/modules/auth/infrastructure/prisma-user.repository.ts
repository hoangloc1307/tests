import { inject, injectable } from 'tsyringe';

import { User } from '~/modules/auth/domain/user.entity';
import type { UserRepository } from '~/modules/auth/domain/user.repository';
import { TOKENS } from '~/shared/infrastructure/di/tokens';

import type { PrismaClient } from '~/shared/infrastructure/prisma';

@injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(@inject(TOKENS.PrismaClient) private prisma: PrismaClient) {}

  async findByUsername(username: string): Promise<User | null> {
    const account = await this.prisma.systemAccount.findUnique({
      where: { username },
      select: {
        accountId: true,
        username: true,
        displayName: true,
        email: true,
        passwordHash: true,
        status: true,
      },
    });

    if (!account) {
      return null;
    }

    return new User({
      accountId: account.accountId,
      username: account.username,
      displayName: account.displayName,
      email: account.email,
      passwordHash: account.passwordHash,
      status: account.status,
    });
  }

  async updatePasswordHash(username: string, passwordHash: string): Promise<void> {
    await this.prisma.systemAccount.update({
      where: { username },
      data: {
        passwordHash,
        updatedDate: new Date(),
      },
    });
  }
}
