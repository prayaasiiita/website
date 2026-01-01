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

export async function GET(request: NextRequest) {
  try {
    const isAuth = await verifyAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const volunteers = await Volunteer.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ volunteers }, { status: 200 });
  } catch (error) {
    console.error('Get volunteers error:', error);
    return NextResponse.json({ error: 'Failed to fetch volunteers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuth = await verifyAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Input validation
    if (!body.name || !body.email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Sanitize email
    const email = body.email.toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    await dbConnect();
    const volunteer = await Volunteer.create({ ...body, email });
    return NextResponse.json({ volunteer }, { status: 201 });
  } catch (error) {
    console.error('Create volunteer error:', error);
    return NextResponse.json({ error: 'Failed to create volunteer' }, { status: 500 });
  }
}
