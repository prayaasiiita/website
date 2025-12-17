import { NextResponse } from 'next/server';

export async function POST() {
  const noStoreHeaders = { 'Cache-Control': 'no-store' };

  const response = NextResponse.json(
    { success: true, message: 'Logged out successfully' },
    { status: 200, headers: noStoreHeaders }
  );

  response.cookies.delete('admin_token');

  return response;
}
