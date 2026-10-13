import type { NextFunction, Request, Response } from 'express';
import path from 'path';
import { AppError } from '~/shared/domain/app-error';
import type { FileExtension } from '~/shared/domain/file-type';
import { getFilesFromReq, resolveAllowed } from '~/shared/presentation/upload';

type FormFieldType = 'file' | 'text';

interface FormFieldRule {
  field: string;
  type: FormFieldType;
  required?: boolean;
  allow?: FileExtension[];
  maxSize?: number;
  minCount?: number;
  maxCount?: number;
}

export const fileValidator = (rules: FormFieldRule[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const files: Record<string, Express.Multer.File[]> = {};
    const body: Record<string, string> = {};

    for (const rule of rules) {
      if (rule.type === 'file') {
        const ruleFiles = getFilesFromReq(req, rule.field);

        if (rule.required && ruleFiles.length === 0) {
          return next(AppError.validation('common:upload.required', { field: rule.field }));
        }

        if (rule.minCount && ruleFiles.length > 0 && ruleFiles.length < rule.minCount) {
          return next(
            AppError.validation('common:upload.minCount', {
              field: rule.field,
              min: String(rule.minCount),
            }),
          );
        }

        if (rule.maxCount && ruleFiles.length > rule.maxCount) {
          return next(
            AppError.validation('common:upload.maxCount', {
              field: rule.field,
              max: String(rule.maxCount),
            }),
          );
        }

        const { mimes: allowedMimes, exts: allowedExts } = resolveAllowed(rule.allow ?? []);

        for (const file of ruleFiles) {
          if (rule.maxSize && file.size > rule.maxSize) {
            return next(
              AppError.contentTooLarge('common:upload.tooLarge', {
                field: rule.field,
                max: String(rule.maxSize),
              }),
            );
          }

          const ext = path.extname(file.originalname).toLowerCase();
          const mimeOk = allowedMimes.size ? allowedMimes.has(file.mimetype) : true;
          const extOk = allowedExts.size ? allowedExts.has(ext) : true;

          if (!mimeOk || !extOk) {
            return next(
              AppError.validation('common:upload.invalidType', {
                field: rule.field,
                ext,
                mime: file.mimetype,
              }),
            );
          }
        }

        files[rule.field] = ruleFiles;
      }

      if (rule.type === 'text') {
        const value = (req.body as Record<string, string>)[rule.field];
        if (rule.required && !value) {
          return next(AppError.validation('common:upload.required', { field: rule.field }));
        }
        body[rule.field] = value;
      }
    }

    req.validatedData = { ...(req.validatedData ?? {}), files, body };

    next();
  };
};
