import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Admin, { ALL_PERMISSIONS, Permission } from '@/src/models/Admin';
import { comparePassword, generateToken } from '@/src/lib/auth';
import { createAuditLog } from '@/src/lib/audit';
import { auditSecurityEvent } from '@/src/lib/audit-helpers';

// Simple rate limiting (in production, use Redis)
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  if (!attempt || now > attempt.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 }); // 15 min window
    return true;
  }

  if (attempt.count >= 5) {
    return false;
  }

  attempt.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const noStoreHeaders = {
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
  };

  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    if (!checkRateLimit(ip)) {
      // Log rate limit violation
      auditSecurityEvent({
        request,
        eventType: 'rate_limit',
        ipAddress: ip,
        details: { endpoint: '/api/auth/login' },
        severity: 'warning',
      });

      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429, headers: noStoreHeaders }
      );
    }

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400, headers: noStoreHeaders }
      );
    }

    // Input validation
    if (typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input format' },
        { status: 400, headers: noStoreHeaders }
      );
    }

    if (username.length > 50 || password.length > 100) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401, headers: noStoreHeaders }
      );
    }

    await dbConnect();

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401, headers: noStoreHeaders }
      );
    }

    // Check if admin is active
    if (admin.isActive === false) {
      return NextResponse.json(
        { error: 'Account is disabled. Please contact administrator.' },
        { status: 403, headers: noStoreHeaders }
      );
    }

    const isPasswordValid = await comparePassword(password, admin.password);

    if (!isPasswordValid) {
      // Log failed login attempt
      createAuditLog({
        action: 'login',
        resource: 'auth',
        admin: {
          userId: admin._id.toString(),
          username: admin.username,
          email: admin.email,
        },
        request,
        status: 'failure',
        errorMessage: 'Invalid password',
      }).catch(err => console.error('Audit log failed:', err));

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401, headers: noStoreHeaders }
      );
    }

    // Migration: If admin doesn't have role set, make them super_admin (existing admins)
    if (!admin.role) {
      admin.role = 'super_admin';
      admin.permissions = ALL_PERMISSIONS;
      await admin.save();
      console.log(`Migrated existing admin ${admin.username} to super_admin role`);
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken({
      userId: admin._id.toString(),
      username: admin.username,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions as Permission[],
    });

    // Log successful login
    createAuditLog({
      action: 'login',
      resource: 'auth',
      admin: {
        userId: admin._id.toString(),
        username: admin.username,
        email: admin.email,
      },
      request,
      status: 'success',
    }).catch(err => console.error('Audit log failed:', err));

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
        },
      },
      { status: 200, headers: noStoreHeaders }
    );

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Changed from 'lax' to 'strict' for better CSRF protection
      maxAge: 60 * 60 * 24, // 24 hours (reduced from 7 days)
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: noStoreHeaders }
    );
  }
}
