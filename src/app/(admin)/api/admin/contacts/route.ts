import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/src/lib/auth';
import dbConnect from '@/src/lib/mongodb';
import ContactSubmission from '@/src/models/ContactSubmission';

/**
 * GET /api/admin/contacts
 * Fetch all contact form submissions (requires manage_contacts permission)
 */
export async function GET(request: NextRequest) {
    try {
        // Verify admin authentication and permission
        const authResult = await requirePermission(request, 'manage_contacts');
        if ('error' in authResult) return authResult.error;

        // Connect to database
        await dbConnect();

        // Fetch all contact submissions, sorted by newest first
        const contacts = await ContactSubmission.find()
            .sort({ createdAt: -1 })
            .lean()
            .exec();

        return NextResponse.json({
            success: true,
            contacts,
            total: contacts.length,
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch contacts' },
            { status: 500 }
        );
    }
}
