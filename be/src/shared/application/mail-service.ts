import type { Attachment } from 'nodemailer/lib/mailer';

export interface MailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: Attachment[];
  template?: string;
  data?: Record<string, unknown>;
}

export interface MailService {
  send(options: MailOptions): Promise<void>;
}
