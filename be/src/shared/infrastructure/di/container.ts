import 'reflect-metadata';
import { container } from 'tsyringe';
import type { PasswordVerifier } from '~/modules/auth/domain/password-hasher';
import type { TokenService } from '~/modules/auth/domain/token-service';
import type { UserRepository } from '~/modules/auth/domain/user.repository';
import { CryptoPasswordVerifier } from '~/modules/auth/infrastructure/crypto-password.verifier';
import { JwtTokenService } from '~/modules/auth/infrastructure/jwt-token.service';
import { PrismaUserRepository } from '~/modules/auth/infrastructure/prisma-user.repository';
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
container.registerSingleton<PasswordVerifier>(TOKENS.PasswordVerifier, CryptoPasswordVerifier);
container.registerSingleton<TokenService>(TOKENS.TokenService, JwtTokenService);
container.registerSingleton<UserRepository>(TOKENS.UserRepository, PrismaUserRepository);

export { container };
