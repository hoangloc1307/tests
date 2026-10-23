import type { CreateRoleInput } from 'shared/schemas/auth';
import { RoleResponse } from 'shared/types/auth';

export type Role = RoleResponse;
export interface CreateRoleData extends CreateRoleInput {
  createdBy: string;
}

export interface RoleRepository {
  create(data: CreateRoleData): Promise<Role>;
}
