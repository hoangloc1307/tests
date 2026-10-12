export interface UserProps {
  accountId: string;
  username: string;
  displayName: string | null;
  email: string | null;
  passwordHash: string;
  status: number | null;
}

export class User {
  readonly accountId: string;
  readonly username: string;
  readonly displayName: string | null;
  readonly email: string | null;
  readonly passwordHash: string;
  readonly status: number | null;

  constructor(props: UserProps) {
    this.accountId = props.accountId;
    this.username = props.username;
    this.displayName = props.displayName;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.status = props.status;
  }

  canAuthenticate(): boolean {
    // Status 0 = active, other values may indicate locked/disabled
    return this.status === 0;
  }
}
