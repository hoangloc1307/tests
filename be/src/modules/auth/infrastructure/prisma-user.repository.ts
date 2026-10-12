import { User } from '~/modules/auth/domain/user.entity';
import type { UserRepository } from '~/modules/auth/domain/user.repository';
import { prisma } from '~/shared/infrastructure/prisma';

export class PrismaUserRepository implements UserRepository {
  async findByUsername(username: string): Promise<User | null> {
    const account = await prisma.systemAccount.findUnique({
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
    await prisma.systemAccount.update({
      where: { username },
      data: {
        passwordHash,
        updatedDate: new Date(),
      },
    });
  }
}
