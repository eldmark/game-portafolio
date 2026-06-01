import jwt from 'jsonwebtoken';

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

const JWT_SECRET = requireEnv('JWT_SECRET', process.env.JWT_SECRET);

const JWT_EXPIRES_IN = '1d';

export type TokenPayload = {
  userId: string;
  email: string;
};

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as unknown as TokenPayload;
}
