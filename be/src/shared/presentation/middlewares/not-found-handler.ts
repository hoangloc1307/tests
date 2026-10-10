import type { NextFunction, Request, Response } from 'express';
import { AppError } from '~/shared/domain/app-error';

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(AppError.notFound('common:error.notFound'));
};
