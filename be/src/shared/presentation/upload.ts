import type { Request } from 'express';
import { FILE_EXTENSION, type FileExtension } from '~/shared/domain/file-type';

export const getFilesFromReq = (req: Request, field: string): Express.Multer.File[] => {
  if (req.file && req.file.fieldname === field) return [req.file];

  const files = req.files;
  if (!files) return [];

  if (Array.isArray(files)) return files.filter((file) => file.fieldname === field);

  return files[field] ?? [];
};

export const resolveAllowed = (
  allow: FileExtension[],
): {
  mimes: Set<string>;
  exts: Set<string>;
} => {
  const mimes = new Set<string>();
  const exts = new Set<string>();

  for (const type of allow) {
    const fileType = FILE_EXTENSION[type];
    if (fileType) {
      mimes.add(fileType.mime);
      fileType.exts.forEach((ext) => exts.add(ext));
    }
  }

  return { mimes, exts };
};
