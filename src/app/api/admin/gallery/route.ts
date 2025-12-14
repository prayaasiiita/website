import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Gallery from '@/src/models/Gallery';
import { verifyToken } from '@/src/lib/auth';

async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token || !verifyToken(token)) {
    return false;
  }
  return true;
}

export async function GET() {
  try {
    await dbConnect();
    const images = await Gallery.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ images }, { status: 200 });
  } catch (error) {
    console.error('Get gallery error:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuth = await verifyAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await dbConnect();

    const image = await Gallery.create(body);
    return NextResponse.json({ image }, { status: 201 });
  } catch (error) {
    console.error('Create gallery item error:', error);
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 });
  }
}
