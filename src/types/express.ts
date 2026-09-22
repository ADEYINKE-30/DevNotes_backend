import type { Request } from 'express';
import type { UserDocument } from './auth.js';

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

export {};
