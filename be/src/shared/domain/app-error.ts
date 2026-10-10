import { ERROR_CODES, type ErrorCode } from '~/shared/domain/error-codes';

/**
 * Framework-agnostic application error (Domain layer).
 *
 * The domain and application layers throw `AppError` to signal failures without
 * knowing anything about Express — and without translating anything. An error
 * carries a stable `errorCode` and a `translationKey` (an i18n key). The
 * presentation layer's `errorHandler` is the single place that resolves the
 * key into a localized message for the response.
 *
 * `httpStatusCode` is a transport-neutral hint; the number happens to align
 * with HTTP but the domain imports no HTTP constant.
 */
export class AppError extends Error {
  readonly httpStatusCode: number;
  readonly errorCode: ErrorCode;
  /** i18n key, resolved to a message by the presentation layer. */
  readonly translationKey: string;
  readonly metadata?: Record<string, string>;

  constructor(
    httpStatusCode: number,
    errorCode: ErrorCode,
    translationKey: string,
    metadata?: Record<string, string>,
  ) {
    // Store the key as Error.message too — useful in logs/stack traces.
    super(translationKey);
    this.name = 'AppError';
    this.httpStatusCode = httpStatusCode;
    this.errorCode = errorCode;
    this.translationKey = translationKey;
    this.metadata = metadata;
    Error.captureStackTrace?.(this, AppError);
  }

  static badRequest(translationKey: string, metadata?: Record<string, string>) {
    return new AppError(400, ERROR_CODES.BAD_REQUEST, translationKey, metadata);
  }

  static unauthorized(translationKey: string, metadata?: Record<string, string>) {
    return new AppError(401, ERROR_CODES.UNAUTHORIZED, translationKey, metadata);
  }

  static forbidden(translationKey: string, metadata?: Record<string, string>) {
    return new AppError(403, ERROR_CODES.FORBIDDEN, translationKey, metadata);
  }

  static notFound(translationKey: string, metadata?: Record<string, string>) {
    return new AppError(404, ERROR_CODES.NOT_FOUND, translationKey, metadata);
  }

  static conflict(translationKey: string, metadata?: Record<string, string>) {
    return new AppError(409, ERROR_CODES.CONFLICT, translationKey, metadata);
  }

  static validation(translationKey: string, metadata?: Record<string, string>) {
    return new AppError(422, ERROR_CODES.VALIDATION_ERROR, translationKey, metadata);
  }

  static server(translationKey: string, metadata?: Record<string, string>) {
    return new AppError(500, ERROR_CODES.INTERNAL_SERVER_ERROR, translationKey, metadata);
  }
}
