export const TOKENS = {
  // Shared services
  Logger: Symbol.for('Logger'),
  Translator: Symbol.for('Translator'),
  MailService: Symbol.for('MailService'),
  TemplateRenderer: Symbol.for('TemplateRenderer'),
  PrismaClient: Symbol.for('PrismaClient'),

  // Auth services
  AuthClient: Symbol.for('AuthClient'),
  PermissionClient: Symbol.for('PermissionClient'),
  TokenService: Symbol.for('TokenService'),
} as const;
