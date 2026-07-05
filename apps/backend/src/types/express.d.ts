// Augment Express's Request with the raw request body captured by the
// express.json() verify callback in index.ts (needed for webhook HMAC checks).
declare global {
  namespace Express {
    interface Request {
      rawBody?: Buffer;
    }
  }
}

export {};
