import crypto from 'node:crypto';
import { injectable } from 'tsyringe';
import type { PasswordVerifier } from '~/modules/auth/domain/password-hasher';
import { env } from '~/shared/infrastructure/env';

const IV = Buffer.alloc(16, 0);
const SALT = 'GfG';

@injectable()
export class CryptoPasswordVerifier implements PasswordVerifier {
  verify(hash: string, securityStamp: string, plain: string): boolean {
    const keySource = securityStamp || env.JWT_SECRET;
    const key = crypto.scryptSync(keySource, SALT, 32);

    const encryptedText = Buffer.from(hash, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), IV);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString() === plain;
  }
}
