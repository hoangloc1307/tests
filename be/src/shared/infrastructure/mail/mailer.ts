import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';
import type { Logger } from '~/shared/application/logger';
import type { MailOptions, MailService } from '~/shared/application/mail-service';
import type { TemplateRenderer } from '~/shared/application/template-renderer';
import { TOKENS } from '~/shared/infrastructure/di/tokens';
import { env } from '~/shared/infrastructure/env';

@injectable()
export class NodemailerService implements MailService {
  private transporter: Transporter;

  constructor(
    @inject(TOKENS.Logger) private logger: Logger,
    @inject(TOKENS.TemplateRenderer) private templateRenderer: TemplateRenderer,
  ) {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      ...(env.SMTP_USER &&
        env.SMTP_PASS && {
          auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
          },
        }),
    });
  }

  async send(options: MailOptions): Promise<void> {
    if (!env.SMTP_ENABLED) {
      this.logger.info(
        { to: options.to, subject: options.subject },
        'Email skipped (SMTP disabled)',
      );
      return;
    }

    let html = options.html;
    if (options.template) {
      html = this.templateRenderer.render(options.template, options.data ?? {});
    }

    try {
      const info = await this.transporter.sendMail({
        from: env.SMTP_FROM,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        text: options.text,
        html,
        cc: options.cc,
        bcc: options.bcc,
        replyTo: options.replyTo,
        attachments: options.attachments,
      });

      this.logger.info({ messageId: info.messageId }, 'Email sent successfully');
    } catch (error) {
      this.logger.error({ error, to: options.to }, 'Failed to send email');
      throw error;
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.info('SMTP connection verified successfully');
      return true;
    } catch (error) {
      this.logger.error({ error }, 'SMTP connection verification failed');
      return false;
    }
  }
}
