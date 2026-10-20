import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { AppError } from '~/shared/domain/app-error';

export interface BodyParserOptions {
  /** Field in the multipart form that carries the JSON payload. Defaults to `data`. */
  dataField?: string;
  /** multer upload instance to use. Defaults to in-memory storage. */
  upload?: multer.Multer;
}

/** Writes the parsed payload to both `req.body` and `req.validatedData.body`. */
const setBody = (req: Request, body: Record<string, unknown>) => {
  req.body = body;
  req.validatedData = { ...(req.validatedData ?? {}), body };
};

/**
 * Content-type aware body parser.
 *
 * - `multipart/form-data`: parses files into `req.files` (via multer) and the JSON
 *   payload carried in the `data` field into the body.
 * - anything else: keeps the body produced by the upstream JSON/urlencoded parser.
 *
 * In both cases the parsed object is exposed on `req.validatedData.body`, so downstream
 * handlers always read the request through `req.validatedData` ({ body, files }).
 */
export const bodyParser = (options: BodyParserOptions = {}) => {
  const dataField = options.dataField ?? 'data';
  const upload = options.upload ?? multer({ storage: multer.memoryStorage() });

  return (req: Request, res: Response, next: NextFunction) => {
    const contentType = (req.headers['content-type'] ?? '').toLowerCase();

    if (!contentType.includes('multipart/form-data')) {
      setBody(req, (req.body as Record<string, unknown>) ?? {});
      next();
      return;
    }

    upload.any()(req, res, (err: unknown) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          next(AppError.badRequest('common:upload.invalid', { reason: err.code }));
          return;
        }
        next(err);
        return;
      }

      const raw = (req.body as Record<string, unknown>)?.[dataField];

      if (raw === undefined) {
        setBody(req, {});
        next();
        return;
      }

      if (typeof raw !== 'string') {
        next(AppError.validation('common:upload.invalidData', { field: dataField }));
        return;
      }

      try {
        setBody(req, JSON.parse(raw));
      } catch {
        next(AppError.validation('common:upload.invalidData', { field: dataField }));
        return;
      }

      next();
    });
  };
};
