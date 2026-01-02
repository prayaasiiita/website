import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import { verifyAuth } from '@/src/lib/auth';
import { hashPassword } from '@/src/lib/auth';
import Admin from '@/src/models/Admin';
import { sendPasswordChangeConfirmation } from '@/src/lib/email';
import { createAuditLog } from '@/src/lib/audit';
import { apiRateLimiter } from '@/src/lib/security';

export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
        if (!apiRateLimiter.checkLimit(ip, 10, 60 * 1000)) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        // Verify authentication
        const adminPayload = await verifyAuth(request);
        if (!adminPayload) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { currentPassword, newPassword } = await request.json();

        // Validate inputs
        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: 'Current password and new password are required' },
                { status: 400 }
            );
        }

        // Password strength validation
        if (newPassword.length < 8) {
            return NextResponse.json(
                { error: 'New password must be at least 8 characters long' },
                { status: 400 }
            );
        }

        if (newPassword.length > 128) {
            return NextResponse.json(
                { error: 'Password is too long' },
                { status: 400 }
            );
        }

        const hasLetter = /[a-zA-Z]/.test(newPassword);
        const hasNumber = /[0-9]/.test(newPassword);
        if (!hasLetter || !hasNumber) {
            return NextResponse.json(
                { error: 'Password must contain at least one letter and one number' },
                { status: 400 }
            );
        }

        await dbConnect();

        const admin = await Admin.findById(adminPayload.userId);
        if (!admin) {
            return NextResponse.json(
                { error: 'Admin not found' },
                { status: 404 }
            );
        }

        // Verify current password
        const bcrypt = require('bcryptjs');
        const isValidPassword = await bcrypt.compare(currentPassword, admin.password);

        if (!isValidPassword) {
            // Log failed attempt
            await createAuditLog({
                action: 'password_change',
                resource: 'auth',
                admin: adminPayload,
                request,
                status: 'failure',
                errorMessage: 'Invalid current password',
            });

            return NextResponse.json(
                { error: 'Current password is incorrect' },
                { status: 401 }
            );
        }

        // Hash and update new password
        const hashedPassword = await hashPassword(newPassword);
        admin.password = hashedPassword;
        admin.lastPasswordChange = new Date();
        await admin.save();

        // Send confirmation email (non-blocking)
        sendPasswordChangeConfirmation(admin.email).catch(err => {
            console.error('Failed to send confirmation email:', err);
        });

        // Log successful password change
        await createAuditLog({
            action: 'password_change',
            resource: 'auth',
            admin: adminPayload,
            request,
            status: 'success',
        });

        return NextResponse.json({
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Password change error:', error);
        return NextResponse.json(
            { error: 'An error occurred. Please try again later.' },
            { status: 500 }
        );
    }
}
