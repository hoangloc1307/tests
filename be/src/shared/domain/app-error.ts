import { ERROR_CODES, type ErrorCode } from '~/shared/domain/error-codes';
import { HTTP_STATUS, type HttpStatus } from '~/shared/presentation/http-status';

export class AppError extends Error {
  readonly httpStatusCode: HttpStatus;
  readonly errorCode: ErrorCode;
  readonly translationKey: string;
  readonly metadata?: Record<string, string>;

  constructor(
    httpStatusCode: HttpStatus,
    errorCode: ErrorCode,
    translationKey: string,
    metadata?: Record<string, string>,
  ) {
    super(translationKey);
    this.name = 'AppError';
    this.httpStatusCode = httpStatusCode;
    this.errorCode = errorCode;
    this.translationKey = translationKey;
    this.metadata = metadata;
    Error.captureStackTrace?.(this, AppError);
  }

  static badRequest(translationKey: string, metadata?: Record<string, string>) {
    return new AppError(HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST, translationKey, metadata);
  }

  static unauthorized(translationKey: string, metadata?: Record<string, string>) {
    return new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.UNAUTHORIZED,
      translationKey,
      metadata,
    );
  }

  static forbidden(translationKey: string, metadata?: Record<string, string>) {
    return new AppError(HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN, translationKey, metadata);
  }

  static notFound(translationKey: string, metadata?: Record<string, string>) {
    return new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, translationKey, metadata);
  }

  static conflict(translationKey: string, metadata?: Record<string, string>) {
    return new AppError(HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT, translationKey, metadata);
  }

  static validation(translationKey: string, metadata?: Record<string, string>) {
    return new AppError(
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      ERROR_CODES.VALIDATION_ERROR,
      translationKey,
      metadata,
    );
  }

  static server(translationKey: string, metadata?: Record<string, string>) {
    return new AppError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      translationKey,
      metadata,
    );
  }
}
