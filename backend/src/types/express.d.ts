import { Express } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      user?: {
        id: number;
        username: string;
        email: string;
      };
    }
  }
}
