import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Event from '@/src/models/Event';
import { requirePermission } from '@/src/lib/auth';
import { revalidatePublicTags, TAGS } from '@/src/lib/revalidate-paths';
import { createAuditLog } from '@/src/lib/audit';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requirePermission(request, 'manage_events');
    if ('error' in authResult) return authResult.error;
    const adminPayload = authResult.admin;

    const { id } = await params;
    const body = await request.json();
    await dbConnect();

    // Get previous state for audit
    const previousEvent = await Event.findById(id).lean();
    if (!previousEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const event = await Event.findByIdAndUpdate(id, body, { new: true });

    revalidatePublicTags([TAGS.EVENTS, TAGS.PUBLIC]);

    // Audit log (non-blocking)
    createAuditLog({
      action: 'update',
      resource: 'event',
      resourceId: id,
      admin: adminPayload,
      request,
      changes: {
        before: { title: previousEvent.title, date: previousEvent.date },
        after: { title: body.title, date: body.date },
      },
    });

    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requirePermission(request, 'manage_events');
    if ('error' in authResult) return authResult.error;
    const adminPayload = authResult.admin;

    const { id } = await params;
    await dbConnect();

    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    revalidatePublicTags([TAGS.EVENTS, TAGS.PUBLIC]);

    // Audit log (non-blocking)
    createAuditLog({
      action: 'delete',
      resource: 'event',
      resourceId: id,
      admin: adminPayload,
      request,
      severity: 'warning',
      changes: {
        before: { title: event.title, date: event.date },
        after: null,
      },
    });

    return NextResponse.json({ message: 'Event deleted' }, { status: 200 });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
