import { inject, injectable } from 'tsyringe';
import type { RoleRepository, UserRoleItem } from '~/modules/auth/domain/role.repository';
import { TOKENS } from '~/shared/infrastructure/di/tokens';

@injectable()
export class ListRolesUseCase {
  constructor(@inject(TOKENS.RoleRepository) private readonly roleRepository: RoleRepository) {}

  async execute(): Promise<UserRoleItem[]> {
    return this.roleRepository.findAll();
  }
}
