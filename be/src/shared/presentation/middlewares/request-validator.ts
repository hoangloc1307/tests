import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '~/shared/domain/app-error';

export const requestValidator =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const first = result.error.issues[0];
      const key = first?.message ?? 'common:validation.invalid';
      const field = first?.path.join('.') ?? '';
      next(AppError.validation(key, field ? { field } : undefined));
      return;
    }

    req.body = result.data;
    req.validatedData = {
      ...(req.validatedData ?? {}),
      body: result.data as Record<string, unknown>,
    };
    next();
  };
