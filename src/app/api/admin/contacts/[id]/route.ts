import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/src/lib/auth';
import dbConnect from '@/src/lib/mongodb';
import ContactSubmission from '@/src/models/ContactSubmission';

/**
 * DELETE /api/admin/contacts/[id]
 * Delete a specific contact submission (requires admin authentication)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Verify admin authentication
        const authResult = await verifyAuth(request);
        if (!authResult) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

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
