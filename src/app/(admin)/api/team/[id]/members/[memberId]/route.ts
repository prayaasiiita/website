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

// GET - Fetch a single member from a team group
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    await dbConnect();

    const { id, memberId } = await params;
    const group = await TeamGroup.findById(id);

    if (!group) {
      return NextResponse.json({ error: 'Team group not found' }, { status: 404 });
    }

    const member = group.members.id(memberId);
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json({ member }, { status: 200 });
  } catch (error) {
    console.error('Error fetching team member:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team member' },
      { status: 500 }
    );
  }
}

// PUT - Update a team member (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const payload = verifyAdmin(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id, memberId } = await params;
    const body = await request.json();
    const { name, role, rollNo, image, email, linkedin, order, isVisible } = body;

    const group = await TeamGroup.findById(id);
    if (!group) {
      return NextResponse.json({ error: 'Team group not found' }, { status: 404 });
    }

    const member = group.members.id(memberId);
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Update fields if provided
    if (name !== undefined) member.name = name;
    if (role !== undefined) member.role = role;
    if (rollNo !== undefined) member.rollNo = rollNo;
    if (image !== undefined) member.image = image;
    if (email !== undefined) member.email = email;
    if (linkedin !== undefined) member.linkedin = linkedin;
    if (order !== undefined) member.order = order;
    if (isVisible !== undefined) member.isVisible = isVisible;

    await group.save();

    revalidatePublicTags([TAGS.TEAM, TAGS.PUBLIC]);
    return NextResponse.json(
      { message: 'Member updated successfully', member, group },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a member from a team group (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const payload = verifyAdmin(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id, memberId } = await params;
    const group = await TeamGroup.findById(id);

    if (!group) {
      return NextResponse.json({ error: 'Team group not found' }, { status: 404 });
    }

    const member = group.members.id(memberId);
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Remove the member using pull
    group.members.pull({ _id: memberId });
    await group.save();

    revalidatePublicTags([TAGS.TEAM, TAGS.PUBLIC]);
    return NextResponse.json(
      { message: 'Member removed successfully', group },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error removing team member:', error);
    return NextResponse.json(
      { error: 'Failed to remove team member' },
      { status: 500 }
    );
  }
}
