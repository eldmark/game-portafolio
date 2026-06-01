import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

export function notFound(message = 'Resource not found') {
  return new HttpError(404, message);
}

export function unauthorized(message = 'Unauthorized') {
  return new HttpError(401, message);
}

export function forbidden(message = 'Forbidden') {
  return new HttpError(403, message);
}

export function badRequest(message = 'Bad Request', details?: unknown) {
  return new HttpError(400, message, details);
}

export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(422).json({
      error: 'Validation failed',
      details: error.flatten(),
    });
  }

  if (error instanceof HttpError) {
    return res.status(error.status).json({
      error: error.message,
      details: error.details,
    });
  }

  console.error(error);

  return res.status(500).json({
    error: 'Unexpected server error',
  });
}
