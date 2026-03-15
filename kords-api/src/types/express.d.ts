import 'express';

declare global {
  namespace Express {
    interface UserPayload {
      userId: string;
      iat?: number;
      exp?: number;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};