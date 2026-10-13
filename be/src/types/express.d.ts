import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: { username: string };
      validatedData?: {
        files?: Record<string, Express.Multer.File[]>;
        body?: Record<string, string>;
      } & Record<string, unknown>;
    }
  }
}

export {};
