import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import TeamGroup from '@/src/models/TeamGroup';
import { requirePermission } from '@/src/lib/auth';
import { revalidatePublicTags, TAGS } from '@/src/lib/revalidate-paths';
import { createAuditLog } from '@/src/lib/audit';

// GET - Fetch a single team group by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const group = await TeamGroup.findById(id).lean();

    if (!group) {
      return NextResponse.json({ error: 'Team group not found' }, { status: 404 });
    }

    return NextResponse.json({ group }, { status: 200 });
  } catch (error) {
    console.error('Error fetching team group:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team group' },
      { status: 500 }
    );
  }
}

// PUT - Update a team group (requires manage_team permission)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requirePermission(request, 'manage_team');
    if ('error' in authResult) return authResult.error;
    const adminPayload = authResult.admin;

    await dbConnect();

    const { id } = await params;
    const body = await request.json();
    const { name, description, type, order, isVisible } = body;

    const group = await TeamGroup.findById(id);
    if (!group) {
      return NextResponse.json({ error: 'Team group not found' }, { status: 404 });
    }

    // Capture before state
    const beforeState = {
      name: group.name,
      type: group.type,
      isVisible: group.isVisible,
    };

    // Update fields if provided
    if (name !== undefined) {
      group.name = name;
      // Update slug when name changes
      group.slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    if (description !== undefined) group.description = description;
    if (type !== undefined) group.type = type;
    if (order !== undefined) group.order = order;
    if (isVisible !== undefined) group.isVisible = isVisible;

    await group.save();

    // Audit log (non-blocking)
    createAuditLog({
      action: 'update',
      resource: 'team_group',
      resourceId: id,
      admin: adminPayload,
      request,
      changes: {
        before: beforeState,
        after: { name: group.name, type: group.type, isVisible: group.isVisible },
      },
    });

    revalidatePublicTags([TAGS.TEAM, TAGS.PUBLIC]);
    return NextResponse.json(
      { message: 'Team group updated successfully', group },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating team group:', error);
    return NextResponse.json(
      { error: 'Failed to update team group' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a team group (requires manage_team permission)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requirePermission(request, 'manage_team');
    if ('error' in authResult) return authResult.error;
    const adminPayload = authResult.admin;

    await dbConnect();

    const { id } = await params;
    const group = await TeamGroup.findByIdAndDelete(id);

    if (!group) {
      return NextResponse.json({ error: 'Team group not found' }, { status: 404 });
    }

    // Audit log (non-blocking)
    createAuditLog({
      action: 'delete',
      resource: 'team_group',
      resourceId: id,
      admin: adminPayload,
      request,
      severity: 'warning',
      changes: {
        before: { name: group.name, type: group.type },
        after: null,
      },
    });

    revalidatePublicTags([TAGS.TEAM, TAGS.PUBLIC]);
    return NextResponse.json(
      { message: 'Team group deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting team group:', error);
    return NextResponse.json(
      { error: 'Failed to delete team group' },
      { status: 500 }
    );
  }
}
