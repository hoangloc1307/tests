import type { CreateRoleInput, UpdateRoleInput } from 'shared/schemas/auth';
import { RoleListItem } from 'shared/types/auth';

export type UserRoleItem = RoleListItem;

export interface CreateRoleData extends CreateRoleInput {
  createdBy: string;
}

export interface UpdateRoleData extends UpdateRoleInput {
  updatedBy: string;
}

export interface DeleteRoleData {
  id: string;
  updatedBy: string;
}

export interface RoleRepository {
  create(data: CreateRoleData): Promise<void>;
  findAll(): Promise<UserRoleItem[]>;
  update(data: UpdateRoleData): Promise<void>;
  delete(data: DeleteRoleData): Promise<void>;
}
