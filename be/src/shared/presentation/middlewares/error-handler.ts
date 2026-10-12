import type { NextFunction, Request, Response } from 'express';
import type { ApiResponse } from 'shared/types/api';
import type { Translator } from '~/shared/application/translator';
import { AppError } from '~/shared/domain/app-error';
import { ERROR_CODES } from '~/shared/domain/error-codes';
import type { Logger } from '~/shared/domain/logger';
import { container } from '~/shared/infrastructure/di/container';
import { TOKENS } from '~/shared/infrastructure/di/tokens';
import { HTTP_STATUS } from '~/shared/presentation/http-status';

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const translator = container.resolve<Translator>(TOKENS.Translator);
  const logger = container.resolve<Logger>(TOKENS.Logger);

  if (err instanceof AppError) {
    const body: ApiResponse<null> = {
      success: false,
      message: translator.t(err.translationKey),
      data: null,
      errorCode: err.errorCode,
      metadata: err.metadata,
    };
    res.status(err.httpStatusCode).json(body);
    return;
  }

  logger.error({ err }, 'Unhandled error');

  const body: ApiResponse<null> = {
    success: false,
    message: translator.t('common:error.internal'),
    data: null,
    errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
  };
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(body);
};
