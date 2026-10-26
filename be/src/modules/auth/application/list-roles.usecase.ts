import type { RoleListItem } from 'shared/types/auth';
import { inject, injectable } from 'tsyringe';
import type { RoleRepository } from '~/modules/auth/domain/role.repository';
import { TOKENS } from '~/shared/infrastructure/di/tokens';

@injectable()
export class ListRolesUseCase {
  constructor(@inject(TOKENS.RoleRepository) private readonly roleRepository: RoleRepository) {}

  async execute(): Promise<RoleListItem[]> {
    return this.roleRepository.findAll();
  }
}
