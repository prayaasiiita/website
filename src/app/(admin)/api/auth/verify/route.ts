import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/src/lib/auth';

export async function GET(request: NextRequest) {
  const noStoreHeaders = { 'Cache-Control': 'no-store' };

  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401, headers: noStoreHeaders }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401, headers: noStoreHeaders }
      );
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: payload.userId,
          username: payload.username,
          email: payload.email,
          role: payload.role,
          permissions: payload.permissions,
        },
      },
      { status: 200, headers: noStoreHeaders }
    );
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: noStoreHeaders }
    );
  }
}
