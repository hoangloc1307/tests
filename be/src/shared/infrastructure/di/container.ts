import 'reflect-metadata';
import { container } from 'tsyringe';
import type { AuthClient } from '~/modules/auth/domain/auth-client';
import type { HrClient } from '~/modules/auth/domain/hr-client';
import type { PermissionClient } from '~/modules/auth/domain/permission-client';
import type { RoleRepository } from '~/modules/auth/domain/role.repository';
import type { TokenService } from '~/modules/auth/domain/token-service';
import { HttpAuthClient } from '~/modules/auth/infrastructure/http-auth.client';
import { HttpHrClient } from '~/modules/auth/infrastructure/http-hr.client';
import { HttpPermissionClient } from '~/modules/auth/infrastructure/http-permission.client';
import { JwtTokenService } from '~/modules/auth/infrastructure/jwt-token.service';
import { PrismaA5RoleRepository } from '~/modules/auth/infrastructure/prisma-a5-role.repository';
import { A5DocumentHandler } from '~/modules/issue/application/handlers/a5-document.handler';
import type { A5IssueRepository } from '~/modules/issue/domain/a5-issue.repository';
import type { DocumentHandler } from '~/modules/issue/domain/document-handler';
import { PrismaA5IssueRepository } from '~/modules/issue/infrastructure/prisma-a5-issue.repository';
import type { FlowableClient } from '~/shared/application/flowable/flowable-client';
import type { Logger } from '~/shared/application/logger';
import type { MailService } from '~/shared/application/mail-service';
import type { SerialGenerator } from '~/shared/application/serial-generator';
import type { TemplateRenderer } from '~/shared/application/template-renderer';
import type { Translator } from '~/shared/application/translator';
import { TOKENS } from '~/shared/infrastructure/di/tokens';
import { HttpFlowableClient } from '~/shared/infrastructure/flowable/http-flowable.client';
import { I18nextTranslator } from '~/shared/infrastructure/i18n/i18next.translator';
import { PinoLogger } from '~/shared/infrastructure/logger';
import { NodemailerService } from '~/shared/infrastructure/mail/mailer';
import { HandlebarsTemplateRenderer } from '~/shared/infrastructure/mail/template-renderer';
import { prismaA5, type PrismaClientA5 } from '~/shared/infrastructure/prisma-a5';
import { prismaSmart, type PrismaClientSmart } from '~/shared/infrastructure/prisma-smart';
import { PrismaSerialGenerator } from '~/shared/infrastructure/serial/prisma-serial-generator';

// Register shared services
container.registerSingleton<Logger>(TOKENS.Logger, PinoLogger);
container.registerSingleton<Translator>(TOKENS.Translator, I18nextTranslator);
container.registerSingleton<MailService>(TOKENS.MailService, NodemailerService);
container.registerSingleton<TemplateRenderer>(TOKENS.TemplateRenderer, HandlebarsTemplateRenderer);
container.registerSingleton<FlowableClient>(TOKENS.FlowableClient, HttpFlowableClient);
container.registerSingleton<SerialGenerator>(TOKENS.SerialGenerator, PrismaSerialGenerator);
container.registerInstance<PrismaClientSmart>(TOKENS.PrismaClientSmart, prismaSmart);
container.registerInstance<PrismaClientA5>(TOKENS.PrismaClientA5, prismaA5);

// Register auth services
container.registerSingleton<AuthClient>(TOKENS.AuthClient, HttpAuthClient);
container.registerSingleton<HrClient>(TOKENS.HrClient, HttpHrClient);
container.registerSingleton<PermissionClient>(TOKENS.PermissionClient, HttpPermissionClient);
container.registerSingleton<TokenService>(TOKENS.TokenService, JwtTokenService);
container.registerSingleton<RoleRepository>(TOKENS.RoleRepository, PrismaA5RoleRepository);

// Register issue services
container.registerSingleton<A5IssueRepository>(TOKENS.A5IssueRepository, PrismaA5IssueRepository);

// Register document handlers (một handler cho mỗi documentType)
container.registerSingleton<DocumentHandler>(TOKENS.DocumentHandler, A5DocumentHandler);

export { container };
