import jwt from 'jsonwebtoken';

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

const JWT_SECRET = requireEnv('JWT_SECRET', process.env.JWT_SECRET);

const JWT_EXPIRES_IN = '1h';

const JWT_ALGORITHM = 'HS256' as const;

export type TokenPayload = {
  userId: string;
  email: string;
};

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: JWT_ALGORITHM,
  });
}

export function verifyToken(token: string): TokenPayload {
  // Pinning the algorithm keeps verification from depending on a library default.
  return jwt.verify(token, JWT_SECRET, {
    algorithms: [JWT_ALGORITHM],
  }) as unknown as TokenPayload;
}
