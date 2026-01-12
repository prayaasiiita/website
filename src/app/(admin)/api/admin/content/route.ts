import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Content from '@/src/models/Content';
import { requirePermission } from '@/src/lib/auth';
import { revalidatePublicTags, TAGS } from '@/src/lib/revalidate-paths';
import { createAuditLog } from '@/src/lib/audit';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    await dbConnect();

    const query = section ? { section } : {};
    const content = await Content.find(query).sort({ section: 1, key: 1 }).lean();

    return NextResponse.json({ content }, { status: 200 });
  } catch (error) {
    console.error('Get content error:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requirePermission(request, 'manage_content');
    if ('error' in authResult) return authResult.error;
    const adminPayload = authResult.admin;

    const body = await request.json();

    // Input validation
    if (!body.section || !body.key || !body.value) {
      return NextResponse.json({ error: 'Section, key, and value are required' }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedBody = {
      section: body.section.trim().toLowerCase(),
      key: body.key.trim().toLowerCase(),
      value: body.value.trim(),
      type: body.type || 'text',
    };

    await dbConnect();
    const content = await Content.create(sanitizedBody);

    // Audit log (non-blocking)
    createAuditLog({
      action: 'create',
      resource: 'content',
      resourceId: content._id.toString(),
      admin: adminPayload,
      request,
      changes: {
        after: { section: sanitizedBody.section, key: sanitizedBody.key },
      },
    });

    revalidatePublicTags([TAGS.CONTENT, TAGS.PUBLIC]);
    return NextResponse.json({ content }, { status: 201 });
  } catch (error) {
    console.error('Create content error:', error);
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await requirePermission(request, 'manage_content');
    if ('error' in authResult) return authResult.error;
    const adminPayload = authResult.admin;

    const body = await request.json();
    const { section, key, value, type } = body;

    await dbConnect();

    // Get previous value for audit
    const previousContent = await Content.findOne({ section, key }).lean();

    const content = await Content.findOneAndUpdate(
      { section, key },
      { value, type },
      { new: true, upsert: true }
    );

    // Audit log (non-blocking)
    createAuditLog({
      action: 'update',
      resource: 'content',
      resourceId: content._id.toString(),
      admin: adminPayload,
      request,
      changes: {
        before: previousContent ? { value: previousContent.value } : null,
        after: { value },
      },
      metadata: { section, key },
    });

    revalidatePublicTags([TAGS.CONTENT, TAGS.PUBLIC]);
    return NextResponse.json({ content }, { status: 200 });
  } catch (error) {
    console.error('Update content error:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
