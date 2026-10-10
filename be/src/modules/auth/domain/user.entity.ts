/**
 * Domain entity — the innermost layer.
 *
 * Pure business object. It knows nothing about Prisma, Express, or JWT. It only
 * encapsulates the identity and invariants of a User as the business sees it.
 */
export interface UserProps {
  username: string;
  name: string;
  email: string;
  /** Hashed password. The domain never stores plain-text passwords. */
  passwordHash: string;
  isActive: boolean;
}

export class User {
  readonly username: string;
  readonly name: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly isActive: boolean;

  constructor(props: UserProps) {
    this.username = props.username;
    this.name = props.name;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.isActive = props.isActive;
  }

  /** A business rule that belongs to the entity itself. */
  canAuthenticate(): boolean {
    return this.isActive;
  }
}
