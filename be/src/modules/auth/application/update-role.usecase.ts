import { inject, injectable } from 'tsyringe';
import type { RoleRepository, UpdateRoleData } from '~/modules/auth/domain/role.repository';
import { TOKENS } from '~/shared/infrastructure/di/tokens';

@injectable()
export class UpdateRoleUseCase {
  constructor(@inject(TOKENS.RoleRepository) private readonly roleRepository: RoleRepository) {}

  async execute(input: UpdateRoleData): Promise<void> {
    await this.roleRepository.update({
      id: input.id,
      roleId: input.roleId,
      sectionId: input.sectionId,
      updatedBy: input.updatedBy,
    });
  }
}
