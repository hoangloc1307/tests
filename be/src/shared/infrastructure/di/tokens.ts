export const TOKENS = {
  // Shared services
  Logger: Symbol.for('Logger'),
  Translator: Symbol.for('Translator'),
  MailService: Symbol.for('MailService'),
  TemplateRenderer: Symbol.for('TemplateRenderer'),
  PrismaClientSmart: Symbol.for('PrismaClientSmart'),
  PrismaClientA5: Symbol.for('PrismaClientA5'),
  FlowableClient: Symbol.for('FlowableClient'),
  SerialGenerator: Symbol.for('SerialGenerator'),

  // Auth services
  AuthClient: Symbol.for('AuthClient'),
  HrClient: Symbol.for('HrClient'),
  PermissionClient: Symbol.for('PermissionClient'),
  TokenService: Symbol.for('TokenService'),

  // Issue services
  A5IssueRepository: Symbol.for('A5IssueRepository'),
  DocumentHandler: Symbol.for('DocumentHandler'),
} as const;
