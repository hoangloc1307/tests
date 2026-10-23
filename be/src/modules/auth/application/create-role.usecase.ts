import { inject, injectable } from 'tsyringe';
import type { CreateRoleData, RoleRepository } from '~/modules/auth/domain/role.repository';
import { TOKENS } from '~/shared/infrastructure/di/tokens';

@injectable()
export class CreateRoleUseCase {
  constructor(@inject(TOKENS.RoleRepository) private readonly roleRepository: RoleRepository) {}

  async execute(input: CreateRoleData): Promise<void> {
    await this.roleRepository.create({
      username: input.username,
      roleId: input.roleId,
      sectionId: input.sectionId,
      createdBy: input.createdBy,
    });
  }
}
