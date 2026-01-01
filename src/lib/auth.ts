import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn('⚠️  WARNING: JWT_SECRET is not set! Using fallback for development only.');
  console.warn('⚠️  Generate a secure secret: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"');
  console.warn('⚠️  Add JWT_SECRET to your .env.local file before deploying to production!');
}

// Use fallback only in development
const SECRET = JWT_SECRET || (process.env.NODE_ENV === 'development' ? 'dev-secret-change-in-production' : '');

export interface JWTPayload {
  userId: string;
  username: string;
  email: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: JWTPayload): string {
  if (!SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  if (!SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded as JWTPayload;
  } catch {
    return null;
  }
}
