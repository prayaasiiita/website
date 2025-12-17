import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import TeamGroup from '@/src/models/TeamGroup';
import { verifyToken } from '@/src/lib/auth';
import { revalidatePublicTags, TAGS } from '@/src/lib/revalidate-paths';

// Helper to verify admin authentication
function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

// GET - Fetch a single team group by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const group = await TeamGroup.findById(id);

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

// PUT - Update a team group (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = verifyAdmin(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;
    const body = await request.json();
    const { name, description, type, order, isVisible } = body;

    const group = await TeamGroup.findById(id);
    if (!group) {
      return NextResponse.json({ error: 'Team group not found' }, { status: 404 });
    }

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

// DELETE - Delete a team group (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = verifyAdmin(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;
    const group = await TeamGroup.findByIdAndDelete(id);

    if (!group) {
      return NextResponse.json({ error: 'Team group not found' }, { status: 404 });
    }

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
