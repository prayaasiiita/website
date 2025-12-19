import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Content from '@/src/models/Content';
import { verifyToken } from '@/src/lib/auth';
import { revalidatePublicTags, TAGS } from '@/src/lib/revalidate-paths';

async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token || !verifyToken(token)) {
    return false;
  }
  return true;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    await dbConnect();

    const query = section ? { section } : {};
    const content = await Content.find(query).sort({ section: 1, key: 1 });

    return NextResponse.json({ content }, { status: 200 });
  } catch (error) {
    console.error('Get content error:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
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

    const content = await Content.create(body);
    revalidatePublicTags([TAGS.CONTENT, TAGS.PUBLIC]);
    return NextResponse.json({ content }, { status: 201 });
  } catch (error) {
    console.error('Create content error:', error);
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAuth = await verifyAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { section, key, value, type } = body;

    await dbConnect();

    const content = await Content.findOneAndUpdate(
      { section, key },
      { value, type },
      { new: true, upsert: true }
    );

    revalidatePublicTags([TAGS.CONTENT, TAGS.PUBLIC]);
    return NextResponse.json({ content }, { status: 200 });
  } catch (error) {
    console.error('Update content error:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
