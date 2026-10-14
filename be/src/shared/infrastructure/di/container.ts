import 'reflect-metadata';
import { container } from 'tsyringe';
import type { AuthClient } from '~/modules/auth/domain/auth-client';
import type { PermissionClient } from '~/modules/auth/domain/permission-client';
import type { TokenService } from '~/modules/auth/domain/token-service';
import { HttpAuthClient } from '~/modules/auth/infrastructure/http-auth.client';
import { HttpPermissionClient } from '~/modules/auth/infrastructure/http-permission.client';
import { JwtTokenService } from '~/modules/auth/infrastructure/jwt-token.service';
import type { Logger } from '~/shared/application/logger';
import type { MailService } from '~/shared/application/mail-service';
import type { TemplateRenderer } from '~/shared/application/template-renderer';
import type { Translator } from '~/shared/application/translator';
import { TOKENS } from '~/shared/infrastructure/di/tokens';
import { I18nextTranslator } from '~/shared/infrastructure/i18n/i18next.translator';
import { PinoLogger } from '~/shared/infrastructure/logger';
import { NodemailerService } from '~/shared/infrastructure/mail/mailer';
import { HandlebarsTemplateRenderer } from '~/shared/infrastructure/mail/template-renderer';
import { prisma, type PrismaClient } from '~/shared/infrastructure/prisma';

// Register shared services
container.registerSingleton<Logger>(TOKENS.Logger, PinoLogger);
container.registerSingleton<Translator>(TOKENS.Translator, I18nextTranslator);
container.registerSingleton<MailService>(TOKENS.MailService, NodemailerService);
container.registerSingleton<TemplateRenderer>(TOKENS.TemplateRenderer, HandlebarsTemplateRenderer);
container.registerInstance<PrismaClient>(TOKENS.PrismaClient, prisma);

// Register auth services
container.registerSingleton<AuthClient>(TOKENS.AuthClient, HttpAuthClient);
container.registerSingleton<PermissionClient>(TOKENS.PermissionClient, HttpPermissionClient);
container.registerSingleton<TokenService>(TOKENS.TokenService, JwtTokenService);

export { container };
