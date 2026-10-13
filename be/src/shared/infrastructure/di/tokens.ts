export const TOKENS = {
  // Shared services
  Logger: Symbol.for('Logger'),
  Translator: Symbol.for('Translator'),
  MailService: Symbol.for('MailService'),
  TemplateRenderer: Symbol.for('TemplateRenderer'),
  PrismaClient: Symbol.for('PrismaClient'),

  // Repositories
  UserRepository: Symbol.for('UserRepository'),

  // Auth services
  PasswordVerifier: Symbol.for('PasswordVerifier'),
  TokenService: Symbol.for('TokenService'),
} as const;
