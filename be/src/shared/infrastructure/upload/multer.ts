import { format } from 'date-fns';
import fs from 'fs';
import multer, { type Options } from 'multer';
import path from 'path';
import { ALLOWED_EXTS, ALLOWED_MIMES } from '~/shared/domain/file-type';
import { AppError } from '~/shared/domain/app-error';

const UPLOAD_ROOT = path.resolve(process.cwd(), 'uploads');

const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const uploadConfig = (folder: string): Options => {
  const destination = path.join(UPLOAD_ROOT, folder);

  return {
    storage: multer.diskStorage({
      destination: (_req, _file, callback) => {
        ensureDir(destination);
        callback(null, destination);
      },
      filename: (_req, file, callback) => {
        const safeName = file.originalname.replace(/[^\w.-]+/g, '_');
        callback(null, `${format(new Date(), 'yyyyMMddHHmmss')}-${safeName}`);
      },
    }),
    limits: {
      fileSize: 1024 * 1024 * 10, // 10MB
      files: 10,
    },
    fileFilter: (_req, file, callback) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (ALLOWED_EXTS.includes(ext) && ALLOWED_MIMES.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(AppError.unsupportedMediaType('common:upload.unsupportedMediaType'));
      }
    },
  };
};

export const upload = (folder: string) => multer(uploadConfig(folder));
