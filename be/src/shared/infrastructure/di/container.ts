import 'reflect-metadata';
import { container } from 'tsyringe';
import type { AuthClient } from '~/modules/auth/domain/auth-client';
import type { HrClient } from '~/modules/auth/domain/hr-client';
import type { PermissionClient } from '~/modules/auth/domain/permission-client';
import type { TokenService } from '~/modules/auth/domain/token-service';
import { HttpAuthClient } from '~/modules/auth/infrastructure/http-auth.client';
import { HttpHrClient } from '~/modules/auth/infrastructure/http-hr.client';
import { HttpPermissionClient } from '~/modules/auth/infrastructure/http-permission.client';
import { JwtTokenService } from '~/modules/auth/infrastructure/jwt-token.service';
import type { IssueRepository } from '~/modules/issue/domain/issue.repository';
import { PrismaIssueRepository } from '~/modules/issue/infrastructure/prisma-issue.repository';
import type { FlowableClient } from '~/shared/application/flowable-client';
import type { Logger } from '~/shared/application/logger';
import type { MailService } from '~/shared/application/mail-service';
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

// Register shared services
container.registerSingleton<Logger>(TOKENS.Logger, PinoLogger);
container.registerSingleton<Translator>(TOKENS.Translator, I18nextTranslator);
container.registerSingleton<MailService>(TOKENS.MailService, NodemailerService);
container.registerSingleton<TemplateRenderer>(TOKENS.TemplateRenderer, HandlebarsTemplateRenderer);
container.registerSingleton<FlowableClient>(TOKENS.FlowableClient, HttpFlowableClient);
container.registerInstance<PrismaClientSmart>(TOKENS.PrismaClientSmart, prismaSmart);
container.registerInstance<PrismaClientA5>(TOKENS.PrismaClientA5, prismaA5);

// Register auth services
container.registerSingleton<AuthClient>(TOKENS.AuthClient, HttpAuthClient);
container.registerSingleton<HrClient>(TOKENS.HrClient, HttpHrClient);
container.registerSingleton<PermissionClient>(TOKENS.PermissionClient, HttpPermissionClient);
container.registerSingleton<TokenService>(TOKENS.TokenService, JwtTokenService);

// Register issue services
container.registerSingleton<IssueRepository>(TOKENS.IssueRepository, PrismaIssueRepository);

export { container };
