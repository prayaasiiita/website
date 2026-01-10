import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Empowerment from '@/src/models/Empowerment';
import { TAGS } from '@/src/lib/revalidate-paths';
import '@/src/models/Tag'; // register Tag schema for populate

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get('limit') || '8', 10)));

    await dbConnect();
    const items = await Empowerment.find({ status: 'published' })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit)
      .populate('tags')
      .lean();

    return NextResponse.json(
      {
        items: items.map((e: any) => ({
          _id: e._id,
          title: e.title,
          shortDescription: e.shortDescription,
          coverImageUrl: e.coverImageUrl,
          coverImageAlt: e.coverImageAlt,
          slug: e.slug,
          tags: (e.tags || []).map((t: any) => ({ _id: t._id, name: t.name, color: t.color })),
        })),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1800',
          'X-Cache-Tag': TAGS.EMPOWERMENTS,
          'Content-Type': 'application/json; charset=utf-8',
        },
      }
    );
  } catch (e) {
    console.error('GET /api/empowerments error', e);
    return NextResponse.json(
      { error: 'Failed to fetch empowerments', items: [] },
      { status: 500 }
    );
  }
}
