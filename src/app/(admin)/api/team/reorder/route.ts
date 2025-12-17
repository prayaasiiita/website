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

// PUT - Reorder team groups (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const payload = verifyAdmin(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { groupOrders } = body; // Array of { groupId, order }

    if (!Array.isArray(groupOrders)) {
      return NextResponse.json(
        { error: 'groupOrders array is required' },
        { status: 400 }
      );
    }

    // Update order for each group
    const updatePromises = groupOrders.map(({ groupId, order }) =>
      TeamGroup.findByIdAndUpdate(groupId, { order }, { new: true })
    );

    await Promise.all(updatePromises);

    // Fetch updated groups
    const groups = await TeamGroup.find().sort({ order: 1 });

    revalidatePublicTags([TAGS.TEAM, TAGS.PUBLIC]);
    return NextResponse.json(
      { message: 'Groups reordered successfully', groups },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error reordering groups:', error);
    return NextResponse.json(
      { error: 'Failed to reorder groups' },
      { status: 500 }
    );
  }
}
