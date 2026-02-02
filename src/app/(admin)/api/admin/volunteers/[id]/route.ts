import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Volunteer from '@/src/models/Volunteer';
import { requirePermission } from '@/src/lib/auth';
import { createAuditLog } from '@/src/lib/audit';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requirePermission(request, 'manage_volunteers');
    if ('error' in authResult) return authResult.error;
    const adminPayload = authResult.admin;

    const { id } = await params;
    const body = await request.json();
    await dbConnect();

    // Get previous state for audit
    const previousVolunteer = await Volunteer.findById(id).lean();
    if (!previousVolunteer) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    const volunteer = await Volunteer.findByIdAndUpdate(id, body, { new: true });

    // Audit log (non-blocking)
    createAuditLog({
      action: 'update',
      resource: 'volunteer',
      resourceId: id,
      admin: adminPayload,
      request,
      changes: {
        before: { name: previousVolunteer.name, email: previousVolunteer.email },
        after: { name: body.name, email: body.email },
      },
    });

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
    const authResult = await requirePermission(request, 'manage_volunteers');
    if ('error' in authResult) return authResult.error;
    const adminPayload = authResult.admin;

    const { id } = await params;
    await dbConnect();

    const volunteer = await Volunteer.findByIdAndDelete(id);
    if (!volunteer) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    // Audit log (non-blocking)
    createAuditLog({
      action: 'delete',
      resource: 'volunteer',
      resourceId: id,
      admin: adminPayload,
      request,
      severity: 'warning',
      changes: {
        before: { name: volunteer.name, email: volunteer.email },
        after: null,
      },
    });

    return NextResponse.json({ message: 'Volunteer deleted' }, { status: 200 });
  } catch (error) {
    console.error('Delete volunteer error:', error);
    return NextResponse.json({ error: 'Failed to delete volunteer' }, { status: 500 });
  }
}
