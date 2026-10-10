import type { NextFunction, Request, Response } from 'express';
import type { ApiResponse } from 'shared/types/api';
import { AppError } from '~/shared/domain/app-error';
import { ERROR_CODES } from '~/shared/domain/error-codes';
import { HTTP_STATUS } from '~/shared/presentation/http-status';
import { I18nextTranslator } from '~/shared/infrastructure/i18n/i18next.translator';

const translator = new I18nextTranslator();

/**
 * Global error handler — the only place that turns errors into HTTP responses.
 * Keeps the Express dependency at the edge of the system.
 */
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    const body: ApiResponse<null> = {
      success: false,
      // The error carries an i18n key; this is the single place it gets resolved.
      message: translator.t(err.translationKey),
      data: null,
      errorCode: err.errorCode,
      metadata: err.metadata,
    };
    res.status(err.httpStatusCode).json(body);
    return;
  }

  console.error('[UnhandledError]', err);

  const body: ApiResponse<null> = {
    success: false,
    message: translator.t('common:error.internal'),
    data: null,
    errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
  };
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(body);
};
