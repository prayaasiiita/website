import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/src/lib/auth';
import { createAuditLog } from '@/src/lib/audit';

export async function POST(request: NextRequest) {
  const noStoreHeaders = { 'Cache-Control': 'no-store' };

  // Get admin info before clearing the token
  const adminPayload = await verifyAuth(request);

  const response = NextResponse.json(
    { success: true, message: 'Logged out successfully' },
    { status: 200, headers: noStoreHeaders }
  );

  response.cookies.delete('admin_token');

  // Log logout event (non-blocking)
  if (adminPayload) {
    createAuditLog({
      action: 'logout',
      resource: 'auth',
      admin: adminPayload,
      request,
    });
  }

  return response;
}
