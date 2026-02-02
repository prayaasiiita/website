import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/src/lib/auth';
import dbConnect from '@/src/lib/mongodb';
import ContactSubmission from '@/src/models/ContactSubmission';
import { createAuditLog } from '@/src/lib/audit';

/**
 * DELETE /api/admin/contacts/[id]
 * Delete a specific contact submission (requires manage_contacts permission)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Verify admin authentication and permission
        const authResult = await requirePermission(request, 'manage_contacts');
        if ('error' in authResult) return authResult.error;
        const adminPayload = authResult.admin;

        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { error: 'Contact ID is required' },
                { status: 400 }
            );
        }

        // Connect to database
        await dbConnect();

        // Delete the contact submission
        const deletedContact = await ContactSubmission.findByIdAndDelete(id);

        if (!deletedContact) {
            return NextResponse.json(
                { error: 'Contact not found' },
                { status: 404 }
            );
        }

        // Audit log (non-blocking)
        createAuditLog({
            action: 'delete',
            resource: 'contact_submission',
            resourceId: id,
            admin: adminPayload,
            request,
            severity: 'warning',
            changes: {
                before: {
                    email: deletedContact.email,
                    subject: deletedContact.subject,
                    firstName: deletedContact.firstName,
                    lastName: deletedContact.lastName,
                },
                after: null,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Contact submission deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting contact:', error);
        return NextResponse.json(
            { error: 'Failed to delete contact' },
            { status: 500 }
        );
    }
}
