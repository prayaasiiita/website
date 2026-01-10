import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Empowerment from '@/src/models/Empowerment';
import '@/src/models/Tag'; // register Tag schema for populate
import { empowermentCreateSchema, slugify } from '@/src/lib/validations/empowerment';
import { verifyToken } from '@/src/lib/auth';
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
    // Rate limiting (read operations have higher limit)
    const ipAddress = getIpAddress(request);
    const rateLimitResult = checkRateLimit(ipAddress, { maxRequests: 100, windowMinutes: 1 });
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429, headers: { 'Retry-After': String(rateLimitResult.resetTime) } }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const q = searchParams.get('q');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    await dbConnect();
    const filter: Record<string, unknown> = {};
    if (status && ['draft', 'published'].includes(status)) filter.status = status;
    if (q) filter.title = { $regex: sanitizeString(q, 100), $options: 'i' };

    const [items, total] = await Promise.all([
      Empowerment.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('tags')
        .lean(),
      Empowerment.countDocuments(filter),
    ]);

    return NextResponse.json({ items, total, page, limit }, { status: 200 });
  } catch (e) {
    console.error('GET /admin/empowerments error', e);
    return NextResponse.json({ error: 'Failed to load empowerments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting (write operations have stricter limits)
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

    const body = await request.json();
    const parsed = empowermentCreateSchema.safeParse(body);
    if (!parsed.success) {
      createAuditLog({
        action: 'create',
        resource: 'empowerment',
        admin,
        request,
        status: 'failure',
        errorMessage: 'Validation failed',
      }).catch(err => console.error('Audit log failed:', err));

      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;

    await dbConnect();

    // Ensure unique slug
    const normalizedSlug = slugify(data.slug);
    const dup = await Empowerment.findOne({ slug: normalizedSlug });
    if (dup) {
      createAuditLog({
        action: 'create',
        resource: 'empowerment',
        admin,
        request,
        status: 'failure',
        errorMessage: 'Slug already exists',
      }).catch(err => console.error('Audit log failed:', err));

      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }

    const now = new Date();
    const doc = await Empowerment.create({
      title: data.title,
      shortDescription: data.shortDescription,
      content: data.content,
      coverImageUrl: data.coverImageUrl,
      coverImageAlt: data.coverImageAlt,
      tags: data.tagIds,
      status: data.status,
      slug: normalizedSlug,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      publishedAt: data.status === 'published' ? now : undefined,
    });

    createAuditLog({
      action: 'create',
      resource: 'empowerment',
      resourceId: doc._id.toString(),
      admin,
      request,
      changes: {
        before: null,
        after: { title: doc.title, slug: doc.slug, status: doc.status },
      },
    }).catch(err => console.error('Audit log failed:', err));

    revalidatePublicTags([TAGS.EMPOWERMENTS]);
    return NextResponse.json({ empowerment: doc }, { status: 201 });
  } catch (e) {
    console.error('POST /empowerments error', e);
    return NextResponse.json({ error: 'Failed to create empowerment' }, { status: 500 });
  }
}
