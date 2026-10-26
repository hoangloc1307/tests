import type { RoleListItem } from 'shared/types/auth';
import { inject, injectable } from 'tsyringe';
import { Role } from '~/modules/auth/domain/role.entity';
import type {
  ActiveUserRole,
  CreateRoleData,
  DeleteRoleData,
  RoleRepository,
  UpdateRoleData,
} from '~/modules/auth/domain/role.repository';
import { AppError } from '~/shared/domain/app-error';
import { TOKENS } from '~/shared/infrastructure/di/tokens';
import type { PrismaClientA5 } from '~/shared/infrastructure/prisma-a5';
import type { PrismaClientSmart } from '~/shared/infrastructure/prisma-smart';
import { Prisma } from '../../../../generated/a5/client';

const PRISMA_UNIQUE_CONSTRAINT_ERROR = 'P2002';
const PRISMA_RECORD_NOT_FOUND = 'P2025';

@injectable()
export class PrismaA5RoleRepository implements RoleRepository {
  constructor(
    @inject(TOKENS.PrismaClientA5) private readonly prisma: PrismaClientA5,
    @inject(TOKENS.PrismaClientSmart) private readonly smart: PrismaClientSmart,
  ) {}

  async create(data: CreateRoleData): Promise<void> {
    const identity = {
      username: data.username,
      roleId: data.roleId,
      sectionId: data.sectionId,
    };

    const row = await this.prisma.userRole.findUnique({
      where: { username_roleId_sectionId: identity },
    });
    const existing = row ? Role.fromPersistence(row) : null;

    // Đã tồn tại và còn active -> trùng phân quyền.
    if (existing?.isActive()) {
      throw AppError.conflict('auth:roleAlreadyGranted');
    }

    // Đã tồn tại nhưng không còn active -> hồi sinh thay vì tạo mới.
    if (existing) {
      await this.prisma.userRole.update({
        where: { id: existing.id },
        data: { isActive: true, updatedBy: data.createdBy },
      });
    } else {
      await this.prisma.userRole.create({
        data: {
          username: data.username,
          roleId: data.roleId,
          roleName: data.roleName,
          sectionId: data.sectionId,
          createdBy: data.createdBy,
        },
      });
    }
  }

  async findAll(): Promise<RoleListItem[]> {
    const rows = await this.prisma.userRole.findMany({
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    });

    const activeRoles = rows
      .map((r) => Role.fromPersistence(r))
      .filter((entity) => entity.isActive());

    const usernames = [...new Set(activeRoles.map((r) => r.username))];
    const accounts = usernames.length
      ? await this.smart.systemAccount.findMany({
          where: { username: { in: usernames } },
          select: { username: true, displayName: true },
        })
      : [];

    const displayNameByUsername = new Map(accounts.map((a) => [a.username.trim(), a.displayName]));

    return activeRoles.map((entity) => ({
      id: entity.id,
      username: entity.username,
      displayName: displayNameByUsername.get(entity.username) ?? null,
      roleId: entity.roleId,
      sectionId: entity.sectionId,
      isAdmin: entity.isAdmin,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: (entity.updatedAt ?? entity.createdAt).toISOString(),
    }));
  }

  async findActiveRolesByUsername(username: string): Promise<ActiveUserRole[]> {
    const rows = await this.prisma.userRole.findMany({
      where: { username: username.trim(), isActive: true },
      select: { roleId: true, roleName: true, sectionId: true },
    });

    return rows.map((row) => ({
      roleId: row.roleId,
      roleName: row.roleName,
      sectionId: row.sectionId.trim(),
    }));
  }

  async update(data: UpdateRoleData): Promise<void> {
    try {
      await this.prisma.userRole.update({
        where: { id: data.id, isActive: true },
        data: {
          roleId: data.roleId,
          sectionId: data.sectionId,
          updatedBy: data.updatedBy,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PRISMA_UNIQUE_CONSTRAINT_ERROR) {
          throw AppError.conflict('auth:roleAlreadyGranted');
        }
        if (error.code === PRISMA_RECORD_NOT_FOUND) {
          throw AppError.notFound('auth:roleNotFound');
        }
      }
      throw error;
    }
  }

  async delete(data: DeleteRoleData): Promise<void> {
    try {
      await this.prisma.userRole.update({
        where: { id: data.id, isActive: true },
        data: { isActive: false, updatedBy: data.updatedBy },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PRISMA_RECORD_NOT_FOUND
      ) {
        throw AppError.notFound('auth:roleNotFound');
      }
      throw error;
    }
  }
}
