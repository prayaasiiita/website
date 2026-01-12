import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Tag from '@/src/models/Tag';
import { tagCreateSchema } from '@/src/lib/validations/empowerment';
import { verifyToken, requirePermission } from '@/src/lib/auth';
import { revalidatePublicTags, TAGS } from '@/src/lib/revalidate-paths';
import { createAuditLog } from '@/src/lib/audit';
import { checkRateLimit } from '@/src/lib/rate-limit';
import { sanitizeString } from '@/src/lib/security';

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
  const verified = verifyToken(token);
  return verified;
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting for read operations
    const ipAddress = getIpAddress(request);
    const rateLimitResult = checkRateLimit(ipAddress, { maxRequests: 100, windowMinutes: 1 });
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429, headers: { 'Retry-After': String(rateLimitResult.resetTime) } }
      );
    }

    await dbConnect();
    const tags = await Tag.find({}).sort({ name: 1 }).lean();
    return NextResponse.json({ tags }, { status: 200 });
  } catch (e) {
    console.error('GET /tags error', e);
    return NextResponse.json({ error: 'Failed to load tags' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for write operations
    const ipAddress = getIpAddress(request);
    const rateLimitResult = checkRateLimit(ipAddress, { maxRequests: 20, windowMinutes: 1 });
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429, headers: { 'Retry-After': String(rateLimitResult.resetTime) } }
      );
    }

    // Permission check
    const authResult = await requirePermission(request, 'manage_tags');
    if ('error' in authResult) return authResult.error;
    const admin = authResult.admin;

    const body = await request.json();
    const parsed = tagCreateSchema.safeParse(body);
    if (!parsed.success) {
      createAuditLog({
        action: 'create',
        resource: 'tag',
        admin,
        request,
        status: 'failure',
        errorMessage: 'Validation failed',
      }).catch(err => console.error('Audit log failed:', err));

      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const name = sanitizeString(parsed.data.name, 100);
    const color = parsed.data.color;

    await dbConnect();

    // Enforce case-insensitive uniqueness
    const existing = await Tag.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (existing) {
      createAuditLog({
        action: 'create',
        resource: 'tag',
        admin,
        request,
        status: 'failure',
        errorMessage: 'Tag already exists',
      }).catch(err => console.error('Audit log failed:', err));

      return NextResponse.json({ error: 'Tag with this name already exists' }, { status: 409 });
    }

    const tag = await Tag.create({ name, color });

    createAuditLog({
      action: 'create',
      resource: 'tag',
      resourceId: tag._id.toString(),
      admin,
      request,
      changes: {
        before: null,
        after: { name: tag.name, color: tag.color },
      },
    }).catch(err => console.error('Audit log failed:', err));

    revalidatePublicTags([TAGS.TAGS]);
    return NextResponse.json({ tag }, { status: 201 });
  } catch (e) {
    console.error('POST /tags error', e);
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }
}
