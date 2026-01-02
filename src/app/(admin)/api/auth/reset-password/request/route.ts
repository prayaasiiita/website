import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Admin from '@/src/models/Admin';
import { generateResetToken, sendPasswordResetEmail } from '@/src/lib/email';
import { apiRateLimiter } from '@/src/lib/security';
import { createAuditLog } from '@/src/lib/audit';

export async function POST(request: NextRequest) {
    try {
        // Rate limiting - 3 requests per 15 minutes per IP
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
        if (!apiRateLimiter.checkLimit(ip, 3, 15 * 60 * 1000)) {
            return NextResponse.json(
                { error: 'Too many reset requests. Please try again later.' },
                { status: 429 }
            );
        }

        const { email } = await request.json();

        // Validate email format
        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Valid email is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

        // Always return success to prevent email enumeration
        const response = NextResponse.json({
            message: 'If an account exists with this email, a password reset link has been sent.'
        });

        // If admin doesn't exist, still return success (security best practice)
        if (!admin) {
            return response;
        }

        // Generate reset token
        const resetToken = generateResetToken();
        const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Save token to database
        admin.resetPasswordToken = resetToken;
        admin.resetPasswordExpires = resetExpires;
        await admin.save();

        // Get base URL from request
        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        const host = request.headers.get('host');
        const baseUrl = `${protocol}://${host}`;

        // Send email (non-blocking)
        sendPasswordResetEmail(admin.email, resetToken, baseUrl).catch(err => {
            console.error('Failed to send reset email:', err);
        });

        // Create audit log
        createAuditLog({
            action: 'password_reset_request',
            resource: 'auth',
            admin: {
                userId: admin._id.toString(),
                username: admin.username,
                email: admin.email,
            },
            request,
            status: 'success',
        }).catch(err => console.error('Audit log failed:', err));

        return response;

    } catch (error) {
        console.error('Password reset request error:', error);
        return NextResponse.json(
            { error: 'An error occurred. Please try again later.' },
            { status: 500 }
        );
    }
}
