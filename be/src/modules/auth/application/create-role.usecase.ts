import { inject, injectable } from 'tsyringe';
import type { CreateRoleData, RoleRepository } from '~/modules/auth/domain/role.repository';
import { AppError } from '~/shared/domain/app-error';
import { TOKENS } from '~/shared/infrastructure/di/tokens';

// Section được phép tạo role (hardcode tạm để test tính năng).
const ALLOWED_SECTION = '2120';

@injectable()
export class CreateRoleUseCase {
  constructor(@inject(TOKENS.RoleRepository) private readonly roleRepository: RoleRepository) {}

  async execute(input: CreateRoleData, grantedSections: string[]): Promise<void> {
    // Chỉ user có role (với quyền ROLE:C) được gán cho bộ phận 2120 mới tạo được role.
    if (!grantedSections.includes(ALLOWED_SECTION)) {
      throw AppError.forbidden('auth:forbidden');
    }

    await this.roleRepository.create({
      username: input.username,
      roleId: input.roleId,
      sectionId: input.sectionId,
      createdBy: input.createdBy,
    });
  }
}
