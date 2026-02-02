import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Tag from '@/src/models/Tag';
import Empowerment from '@/src/models/Empowerment';
import { verifyToken } from '@/src/lib/auth';
import { checkRateLimit } from '@/src/lib/rate-limit';
import { createAuditLog } from '@/src/lib/audit';
import mongoose from 'mongoose';

function getIpAddress(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0] || 
         req.headers.get('x-real-ip') || 
         'unknown';
}

function isAuthed(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token && verifyToken(token) ? true : false;
}

function getAdminFromToken(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Rate limiting
    const ipAddress = getIpAddress(request);
    const rateLimitResult = checkRateLimit(ipAddress, { maxRequests: 20, windowMinutes: 1 });
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429, headers: { 'Retry-After': String(rateLimitResult.resetTime) } }
      );
    }

    if (!isAuthed(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = getAdminFromToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    // Get tag before deletion for audit log
    const tag = await Tag.findById(id);
    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    // Remove tag from all empowerments
    await Empowerment.updateMany(
      { tags: id },
      { $pull: { tags: id } }
    );

    // Delete the tag
    await Tag.findByIdAndDelete(id);

    createAuditLog({
      action: 'delete',
      resource: 'tag',
      resourceId: id,
      admin,
      request,
      changes: {
        before: { name: tag.name, color: tag.color },
        after: null,
      },
    }).catch(err => console.error('Audit log failed:', err));

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error('DELETE /admin/tags/:id error', e);
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
  }
}
