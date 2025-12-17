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

// POST - Add a new member to a team group (Admin only)
export async function POST(
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
    const { name, role, rollNo, image, email, linkedin, order, isVisible } = body;

    if (!name || !role || !email) {
      return NextResponse.json(
        { error: 'Name, role, and email are required' },
        { status: 400 }
      );
    }

    const group = await TeamGroup.findById(id);
    if (!group) {
      return NextResponse.json({ error: 'Team group not found' }, { status: 404 });
    }

    // Get the highest order if not provided
    let memberOrder = order;
    if (memberOrder === undefined) {
      const maxOrder = group.members.reduce(
        (max: number, m: { order: number }) => Math.max(max, m.order),
        -1
      );
      memberOrder = maxOrder + 1;
    }

    const newMember = {
      name,
      role,
      rollNo: rollNo || '',
      image: image || '',
      email,
      linkedin: linkedin || '',
      order: memberOrder,
      isVisible: isVisible !== undefined ? isVisible : true,
    };

    group.members.push(newMember);
    await group.save();

    // Get the newly added member (last one in the array)
    const addedMember = group.members[group.members.length - 1];

    revalidatePublicTags([TAGS.TEAM, TAGS.PUBLIC]);
    return NextResponse.json(
      { message: 'Member added successfully', member: addedMember, group },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding team member:', error);
    return NextResponse.json(
      { error: 'Failed to add team member' },
      { status: 500 }
    );
  }
}

// PUT - Reorder members in a group (Admin only)
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
    const { memberOrders } = body; // Array of { memberId, order }

    if (!Array.isArray(memberOrders)) {
      return NextResponse.json(
        { error: 'memberOrders array is required' },
        { status: 400 }
      );
    }

    const group = await TeamGroup.findById(id);
    if (!group) {
      return NextResponse.json({ error: 'Team group not found' }, { status: 404 });
    }

    // Update order for each member
    for (const { memberId, order } of memberOrders) {
      const member = group.members.id(memberId);
      if (member) {
        member.order = order;
      }
    }

    await group.save();

    revalidatePublicTags([TAGS.TEAM, TAGS.PUBLIC]);
    return NextResponse.json(
      { message: 'Members reordered successfully', group },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error reordering members:', error);
    return NextResponse.json(
      { error: 'Failed to reorder members' },
      { status: 500 }
    );
  }
}
