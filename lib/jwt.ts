import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

interface TokenPayload {
  sub: string;
  role: 'admin';
  type: 'access' | 'refresh';
}

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? 'dev_access_secret_min_32_chars_long_xxxxxx';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'dev_refresh_secret_min_32_chars_long_xxxxxx';
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES ?? '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES ?? '7d';

export const ACCESS_COOKIE = 'es_access';
export const REFRESH_COOKIE = 'es_refresh';

export function verifyPassword(plain: string, hash: string): boolean {
  try {
    return bcrypt.compareSync(plain, hash);
  } catch {
    return false;
  }
}

export function signAccessToken(email: string): string {
  const payload: TokenPayload = { sub: email, role: 'admin', type: 'access' };
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES,
  } as jwt.SignOptions);
}

export function signRefreshToken(email: string): string {
  const payload: TokenPayload = { sub: email, role: 'admin', type: 'refresh' };
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as TokenPayload;
    if (decoded.type !== 'access') return null;
    return decoded;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET) as TokenPayload;
    if (decoded.type !== 'refresh') return null;
    return decoded;
  } catch {
    return null;
  }
}

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
  };
}
