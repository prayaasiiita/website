import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Empowerment from '@/src/models/Empowerment';
import '@/src/models/Tag'; // register Tag schema for populate
import { empowermentCreateSchema, slugify } from '@/src/lib/validations/empowerment';
import { verifyToken } from '@/src/lib/auth';
import { revalidatePublicTags, TAGS } from '@/src/lib/revalidate-paths';
import { createAuditLog } from '@/src/lib/audit';
import { checkRateLimit } from '@/src/lib/rate-limit';
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
  const verified = verifyToken(token);
  return verified;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }
    const item = await Empowerment.findById(id).populate('tags');
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ item }, { status: 200 });
  } catch (e) {
    console.error('GET /admin/empowerments/:id error', e);
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const body = await request.json();
    const parsed = empowermentCreateSchema.safeParse(body);
    if (!parsed.success) {
      createAuditLog({
        action: 'update',
        resource: 'empowerment',
        resourceId: id,
        admin,
        request,
        status: 'failure',
        errorMessage: 'Validation failed',
      }).catch(err => console.error('Audit log failed:', err));

      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const existing = await Empowerment.findById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const newSlug = slugify(parsed.data.slug);
    if (existing.slug !== newSlug) {
      const conflict = await Empowerment.findOne({ slug: new RegExp(`^${newSlug}$`, 'i') });
      if (conflict) {
        createAuditLog({
          action: 'update',
          resource: 'empowerment',
          resourceId: id,
          admin,
          request,
          status: 'failure',
          errorMessage: 'Slug already exists',
        }).catch(err => console.error('Audit log failed:', err));

        return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
      }
    }

    const beforeUpdate = {
      title: existing.title,
      slug: existing.slug,
      status: existing.status,
    };

    existing.title = parsed.data.title;
    existing.shortDescription = parsed.data.shortDescription;
    existing.content = parsed.data.content;
    existing.coverImageUrl = parsed.data.coverImageUrl;
    existing.coverImageAlt = parsed.data.coverImageAlt;
    existing.tags = parsed.data.tagIds;
    existing.slug = newSlug;
    existing.metaTitle = parsed.data.metaTitle;
    existing.metaDescription = parsed.data.metaDescription;

    const switchingToPublished = existing.status !== 'published' && parsed.data.status === 'published';
    existing.status = parsed.data.status;
    if (switchingToPublished && !existing.publishedAt) {
      existing.publishedAt = new Date();
    }
    await existing.save();

    createAuditLog({
      action: 'update',
      resource: 'empowerment',
      resourceId: id,
      admin,
      request,
      changes: {
        before: beforeUpdate,
        after: {
          title: existing.title,
          slug: existing.slug,
          status: existing.status,
        },
      },
    }).catch(err => console.error('Audit log failed:', err));

    revalidatePublicTags([TAGS.EMPOWERMENTS]);
    return NextResponse.json({ item: existing }, { status: 200 });
  } catch (e) {
    console.error('PUT /admin/empowerments/:id error', e);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Rate limiting
    const ipAddress = getIpAddress(request);
    const rateLimitResult = checkRateLimit(ipAddress, { maxRequests: 10, windowMinutes: 1 });
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

    const existing = await Empowerment.findByIdAndDelete(id);
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    createAuditLog({
      action: 'delete',
      resource: 'empowerment',
      resourceId: id,
      admin,
      request,
      changes: {
        before: { title: existing.title, slug: existing.slug, status: existing.status },
        after: null,
      },
    }).catch(err => console.error('Audit log failed:', err));

    revalidatePublicTags([TAGS.EMPOWERMENTS]);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error('DELETE /admin/empowerments/:id error', e);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
