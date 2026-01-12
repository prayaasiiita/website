import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import SiteSettings from '@/src/models/SiteSettings';
import { verifyAuth, requirePermission } from '@/src/lib/auth';
import { revalidatePublicTags, TAGS } from '@/src/lib/revalidate-paths';
import { createAuditLog } from '@/src/lib/audit';

// Phone validation regex (supports various international formats)
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\\s./0-9]*$/;

// GET - Fetch current site settings (admin only)
export async function GET(request: NextRequest) {
    try {
        const adminPayload = await verifyAuth(request);
        if (!adminPayload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Get or create settings (singleton pattern)
        let settings = await SiteSettings.findOne();
        if (!settings) {
            settings = await SiteSettings.create({});
        }

        return NextResponse.json({ settings }, { status: 200 });
    } catch (error) {
        console.error('Get site settings error:', error);
        return NextResponse.json({ error: 'Failed to fetch site settings' }, { status: 500 });
    }
}

// PUT - Update site settings (requires manage_settings permission)
export async function PUT(request: NextRequest) {
    try {
        const authResult = await requirePermission(request, 'manage_settings');
        if ('error' in authResult) return authResult.error;

        const adminPayload = authResult.admin;

        const body = await request.json();
        const { phone, phoneVisible, email, emailVisible, address, addressVisible } = body;

        // Validate phone if provided
        if (phone !== undefined) {
            if (typeof phone !== 'string') {
                return NextResponse.json({ error: 'Phone must be a string' }, { status: 400 });
            }
            if (phone.trim() && !PHONE_REGEX.test(phone.trim())) {
                return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
            }
        }

        // Validate email if provided
        if (email !== undefined) {
            if (typeof email !== 'string') {
                return NextResponse.json({ error: 'Email must be a string' }, { status: 400 });
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.trim() && !emailRegex.test(email.trim())) {
                return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
            }
        }

        // Build update object with only provided fields
        const updateData: Record<string, unknown> = {};

        if (phone !== undefined) updateData.phone = phone.trim();
        if (phoneVisible !== undefined) updateData.phoneVisible = Boolean(phoneVisible);
        if (email !== undefined) updateData.email = email.trim();
        if (emailVisible !== undefined) updateData.emailVisible = Boolean(emailVisible);
        if (address !== undefined) updateData.address = address.trim();
        if (addressVisible !== undefined) updateData.addressVisible = Boolean(addressVisible);

        await dbConnect();

        // Get previous settings for audit log
        const previousSettings = await SiteSettings.findOne().lean();

        // Update or create settings (upsert)
        const settings = await SiteSettings.findOneAndUpdate(
            {},
            { $set: updateData },
            { new: true, upsert: true }
        );

        // Revalidate cache so public pages reflect changes immediately
        revalidatePublicTags([TAGS.SITE_SETTINGS, TAGS.PUBLIC]);

        // Audit log the settings update (non-blocking)
        createAuditLog({
            action: 'update',
            resource: 'site_settings',
            admin: adminPayload,
            request,
            changes: {
                before: previousSettings,
                after: updateData,
            },
        });

        return NextResponse.json({ settings }, { status: 200 });
    } catch (error) {
        console.error('Update site settings error:', error);
        return NextResponse.json({ error: 'Failed to update site settings' }, { status: 500 });
    }
}
