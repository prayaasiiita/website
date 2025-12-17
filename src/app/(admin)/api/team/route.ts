import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import TeamGroup from '@/src/models/TeamGroup';
import { verifyToken } from '@/src/lib/auth';
import { revalidatePublicTags, TAGS } from '@/src/lib/revalidate-paths';
import {
  TEAM_API_SMAXAGE_SECONDS,
  TEAM_API_STALE_SECONDS,
} from '@/src/lib/cache-config';

const cacheHeaders = {
  'Cache-Control': `public, s-maxage=${TEAM_API_SMAXAGE_SECONDS}, stale-while-revalidate=${TEAM_API_STALE_SECONDS}`,
};

// Helper to verify admin authentication
function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

// GET - Fetch all team groups with members
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const includeHidden = searchParams.get('includeHidden') === 'true';
    const type = searchParams.get('type');

    // Build query
    const query: Record<string, unknown> = {};
    if (!includeHidden) {
      query.isVisible = true;
    }
    if (type) {
      query.type = type;
    }

    const groups = await TeamGroup.find(query).sort({ order: 1 });

    // Filter out hidden members for public requests
    const processedGroups = groups.map((group) => {
      const groupObj = group.toObject();
      if (!includeHidden) {
        groupObj.members = groupObj.members
          .filter((m: { isVisible: boolean }) => m.isVisible)
          .sort((a: { order: number }, b: { order: number }) => a.order - b.order);
      } else {
        groupObj.members = groupObj.members.sort(
          (a: { order: number }, b: { order: number }) => a.order - b.order
        );
      }
      return groupObj;
    });

    return NextResponse.json(
      { groups: processedGroups },
      { status: 200, headers: cacheHeaders }
    );
  } catch (error) {
    console.error('Error fetching team groups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team groups' },
      { status: 500 }
    );
  }
}

// POST - Create a new team group (Admin only)
export async function POST(request: NextRequest) {
  try {
    const payload = verifyAdmin(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { name, description, type, order, isVisible } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Group name is required' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingGroup = await TeamGroup.findOne({ slug });
    if (existingGroup) {
      return NextResponse.json(
        { error: 'A group with this name already exists' },
        { status: 400 }
      );
    }

    // Get the highest order if not provided
    let groupOrder = order;
    if (groupOrder === undefined) {
      const highestOrder = await TeamGroup.findOne().sort({ order: -1 });
      groupOrder = highestOrder ? highestOrder.order + 1 : 0;
    }

    const newGroup = await TeamGroup.create({
      name,
      slug,
      description,
      type: type || 'student',
      order: groupOrder,
      members: [],
      isVisible: isVisible !== undefined ? isVisible : true,
    });

    revalidatePublicTags([TAGS.TEAM, TAGS.PUBLIC]);
    return NextResponse.json(
      { message: 'Team group created successfully', group: newGroup },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating team group:', error);
    return NextResponse.json(
      { error: 'Failed to create team group' },
      { status: 500 }
    );
  }
}
