export interface RoleProps {
  id: string;
  username: string;
  roleId: string;
  sectionId: string;
  isAdmin: boolean;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedBy: string | null;
  updatedAt: Date | null;
}

export class Role {
  private constructor(private readonly props: RoleProps) {}

  static fromPersistence(props: RoleProps): Role {
    return new Role(props);
  }

  get id(): string {
    return this.props.id;
  }

  get username(): string {
    return this.props.username.trim();
  }

  get roleId(): string {
    return this.props.roleId;
  }

  get sectionId(): string {
    return this.props.sectionId.trim();
  }

  get isAdmin(): boolean {
    return this.props.isAdmin;
  }

  get updatedAt(): Date | null {
    return this.props.updatedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  isActive(): boolean {
    return this.props.isActive;
  }
}
