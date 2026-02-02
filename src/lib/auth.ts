import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import type { AdminRole, Permission } from '@/src/models/Admin';

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
  role: AdminRole;
  permissions: Permission[];
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
  return jwt.sign(payload, SECRET, { expiresIn: '24h' });
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

/**
 * Verify authentication from request cookie
 * Returns admin payload if authenticated, null otherwise
 */
export async function verifyAuth(request: NextRequest): Promise<JWTPayload | null> {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Check if admin has a specific permission
 */
export function hasPermission(admin: JWTPayload, permission: Permission): boolean {
  // Super admin always has all permissions
  if (admin.role === 'super_admin') return true;
  return admin.permissions.includes(permission);
}

/**
 * Check if admin has any of the specified permissions
 */
export function hasAnyPermission(admin: JWTPayload, permissions: Permission[]): boolean {
  if (admin.role === 'super_admin') return true;
  return permissions.some(p => admin.permissions.includes(p));
}

/**
 * Require authentication - returns error response if not authenticated
 * Returns admin payload if authenticated
 */
export async function requireAuth(request: NextRequest): Promise<{ admin: JWTPayload } | { error: NextResponse }> {
  const admin = await verifyAuth(request);
  if (!admin) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    };
  }
  return { admin };
}

/**
 * Require specific permission - returns error response if not authorized
 */
export async function requirePermission(
  request: NextRequest,
  permission: Permission
): Promise<{ admin: JWTPayload } | { error: NextResponse }> {
  const authResult = await requireAuth(request);
  if ('error' in authResult) return authResult;

  if (!hasPermission(authResult.admin, permission)) {
    return {
      error: NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      )
    };
  }

  return authResult;
}

/**
 * Require any of the specified permissions
 */
export async function requireAnyPermission(
  request: NextRequest,
  permissions: Permission[]
): Promise<{ admin: JWTPayload } | { error: NextResponse }> {
  const authResult = await requireAuth(request);
  if ('error' in authResult) return authResult;

  if (!hasAnyPermission(authResult.admin, permissions)) {
    return {
      error: NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      )
    };
  }

  return authResult;
}

/**
 * Require super admin role
 */
export async function requireSuperAdmin(request: NextRequest): Promise<{ admin: JWTPayload } | { error: NextResponse }> {
  const authResult = await requireAuth(request);
  if ('error' in authResult) return authResult;

  if (authResult.admin.role !== 'super_admin') {
    return {
      error: NextResponse.json(
        { error: 'Forbidden: Super admin access required' },
        { status: 403 }
      )
    };
  }

  return authResult;
}
