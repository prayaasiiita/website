import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Volunteer from '@/src/models/Volunteer';
import { verifyToken } from '@/src/lib/auth';

async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token || !verifyToken(token)) {
    return false;
  }
  return true;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await verifyAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    await dbConnect();

    const volunteer = await Volunteer.findByIdAndUpdate(id, body, { new: true });
    if (!volunteer) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    return NextResponse.json({ volunteer }, { status: 200 });
  } catch (error) {
    console.error('Update volunteer error:', error);
    return NextResponse.json({ error: 'Failed to update volunteer' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await verifyAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const volunteer = await Volunteer.findByIdAndDelete(id);
    if (!volunteer) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Volunteer deleted' }, { status: 200 });
  } catch (error) {
    console.error('Delete volunteer error:', error);
    return NextResponse.json({ error: 'Failed to delete volunteer' }, { status: 500 });
  }
}
