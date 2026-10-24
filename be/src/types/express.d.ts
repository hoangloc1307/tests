import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: { username: string; vnnToken?: string };
      authContext?: {
        sections: string[];
        isSuperAdmin: boolean;
      };
      validatedData?: {
        files?: Record<string, Express.Multer.File[]>;
        body?: Record<string, unknown>;
      } & Record<string, unknown>;
    }
  }
}

export {};
