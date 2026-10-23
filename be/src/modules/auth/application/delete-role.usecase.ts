import { inject, injectable } from 'tsyringe';
import type { DeleteRoleData, RoleRepository } from '~/modules/auth/domain/role.repository';
import { TOKENS } from '~/shared/infrastructure/di/tokens';

@injectable()
export class DeleteRoleUseCase {
  constructor(@inject(TOKENS.RoleRepository) private readonly roleRepository: RoleRepository) {}

  async execute(input: DeleteRoleData): Promise<void> {
    await this.roleRepository.delete({
      id: input.id,
      updatedBy: input.updatedBy,
    });
  }
}
