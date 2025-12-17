import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyToken } from '@/src/lib/auth';

// Helper to verify admin authentication
function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

// POST - Revalidate specific paths
export async function POST(request: NextRequest) {
  try {
    const payload = verifyAdmin(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { paths } = body;

    const revalidated: string[] = [];

    // Revalidate specific paths
    if (Array.isArray(paths)) {
      for (const path of paths) {
        revalidatePath(path);
        revalidated.push(path);
      }
    }

    // If no specific paths, revalidate common pages
    if (!paths || paths.length === 0) {
      const defaultPaths = ['/about', '/', '/get-involved'];
      for (const path of defaultPaths) {
        revalidatePath(path);
        revalidated.push(path);
      }
    }

    return NextResponse.json(
      {
        message: 'Revalidation triggered successfully',
        revalidatedPaths: revalidated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during revalidation:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}
