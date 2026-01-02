import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Admin from '@/src/models/Admin';
import { hashPassword } from '@/src/lib/auth';
import { sendPasswordChangeConfirmation } from '@/src/lib/email';
import { apiRateLimiter } from '@/src/lib/security';
import { createAuditLog } from '@/src/lib/audit';

export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
        if (!apiRateLimiter.checkLimit(ip, 5, 15 * 60 * 1000)) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        const { token, password } = await request.json();

        // Validate inputs
        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token and password are required' },
                { status: 400 }
            );
        }

        if (typeof token !== 'string' || typeof password !== 'string') {
            return NextResponse.json(
                { error: 'Invalid input format' },
                { status: 400 }
            );
        }

        // Password strength validation
        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters long' },
                { status: 400 }
            );
        }

        if (password.length > 128) {
            return NextResponse.json(
                { error: 'Password is too long' },
                { status: 400 }
            );
        }

        // Check password strength (at least one letter and one number)
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        if (!hasLetter || !hasNumber) {
            return NextResponse.json(
                { error: 'Password must contain at least one letter and one number' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Find admin with valid reset token
        const admin = await Admin.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() },
        }).select('+resetPasswordToken +resetPasswordExpires');

        if (!admin) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await hashPassword(password);

        // Update password and clear reset token
        admin.password = hashedPassword;
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpires = undefined;
        admin.lastPasswordChange = new Date();
        await admin.save();

        // Send confirmation email (non-blocking)
        sendPasswordChangeConfirmation(admin.email).catch(err => {
            console.error('Failed to send confirmation email:', err);
        });

        // Create audit log
        createAuditLog({
            action: 'password_reset_complete',
            resource: 'auth',
            admin: {
                userId: admin._id.toString(),
                username: admin.username,
                email: admin.email,
            },
            request,
            status: 'success',
        }).catch(err => console.error('Audit log failed:', err));

        return NextResponse.json({
            message: 'Password reset successfully. You can now login with your new password.'
        });

    } catch (error) {
        console.error('Password reset error:', error);
        return NextResponse.json(
            { error: 'An error occurred. Please try again later.' },
            { status: 500 }
        );
    }
}
