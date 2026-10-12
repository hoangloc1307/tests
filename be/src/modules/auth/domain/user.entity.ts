export interface UserProps {
  username: string;
  name: string;
  email: string;
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

  canAuthenticate(): boolean {
    return this.isActive;
  }
}
