import { inject, injectable } from 'tsyringe';
import { Prisma } from '../../../../generated/a5/client';
import type { CreateRoleData, Role, RoleRepository } from '~/modules/auth/domain/role.repository';
import { AppError } from '~/shared/domain/app-error';
import { TOKENS } from '~/shared/infrastructure/di/tokens';
import type { PrismaClientA5 } from '~/shared/infrastructure/prisma-a5';

const PRISMA_UNIQUE_CONSTRAINT_ERROR = 'P2002';

@injectable()
export class PrismaA5RoleRepository implements RoleRepository {
  constructor(@inject(TOKENS.PrismaClientA5) private readonly prisma: PrismaClientA5) {}

  async create(data: CreateRoleData): Promise<Role> {
    try {
      const userRole = await this.prisma.userRole.create({
        data: {
          username: data.username,
          roleId: data.roleId,
          sectionId: data.sectionId,
          createdBy: data.createdBy,
        },
      });

      return {
        username: userRole.username,
        roleId: userRole.roleId,
        sectionId: userRole.sectionId,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PRISMA_UNIQUE_CONSTRAINT_ERROR
      ) {
        throw AppError.conflict('auth:roleAlreadyGranted');
      }
      throw error;
    }
  }
}
