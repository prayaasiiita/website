import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Event from '@/src/models/Event';
import { requirePermission } from '@/src/lib/auth';
import { revalidatePublicTags, TAGS } from '@/src/lib/revalidate-paths';
import { createAuditLog } from '@/src/lib/audit';

export async function GET() {
  try {
    await dbConnect();
    const events = await Event.find({}).sort({ date: -1 }).lean();
    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requirePermission(request, 'manage_events');
    if ('error' in authResult) return authResult.error;
    const adminPayload = authResult.admin;

    const body = await request.json();

    // Input validation
    if (!body.title || !body.date) {
      return NextResponse.json({ error: 'Title and date are required' }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedBody = {
      ...body,
      title: body.title.trim(),
      description: body.description?.trim() || '',
      date: new Date(body.date),
    };

    await dbConnect();
    const event = await Event.create(sanitizedBody);
    revalidatePublicTags([TAGS.EVENTS, TAGS.PUBLIC]);

    // Audit log the event creation (non-blocking)
    createAuditLog({
      action: 'create',
      resource: 'event',
      resourceId: event._id.toString(),
      admin: adminPayload,
      request,
      changes: { after: { title: sanitizedBody.title, date: sanitizedBody.date } },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
