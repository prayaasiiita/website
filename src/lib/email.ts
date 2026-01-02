import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Email transporter configuration
// For production, use services like SendGrid, AWS SES, or Mailgun
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

/**
 * Send an email
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
    try {
        // Check if email is configured
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn('Email not configured. Skipping email send.');
            console.log('Email would have been sent to:', options.to);
            console.log('Subject:', options.subject);
            return false;
        }

        await transporter.sendMail({
            from: process.env.SMTP_FROM || `"Prayaas Admin" <${process.env.SMTP_USER}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
        });

        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
}

/**
 * Generate a secure password reset token
 */
export function generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
    email: string,
    resetToken: string,
    baseUrl: string
): Promise<boolean> {
    const resetUrl = `${baseUrl}/admin/reset-password?token=${resetToken}`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #e85a4f 0%, #c94a40 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: white; padding: 40px 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .button { display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #e85a4f 0%, #c94a40 100%); color: #ffffff !important; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: 600; box-shadow: 0 4px 12px rgba(232, 90, 79, 0.3); transition: transform 0.2s; }
        .button:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(232, 90, 79, 0.4); }
        .warning { background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 20px; margin: 25px 0; border-radius: 4px; }
        .footer { text-align: center; margin-top: 30px; color: #999; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px; font-weight: 600;">🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <p style="font-size: 16px; margin-bottom: 10px;">Hello,</p>
          <p style="font-size: 15px; line-height: 1.8; color: #555;">You recently requested to reset your password for your <strong>Prayaas Admin</strong> account. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" class="button" style="color: #ffffff !important;">Reset Password</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #4F46E5;">${resetUrl}</p>
          <div class="warning">
            <strong>⚠️ Security Notice:</strong>
            <ul>
              <li>This link will expire in <strong>1 hour</strong></li>
              <li>If you didn't request this reset, please ignore this email</li>
              <li>Never share this link with anyone</li>
            </ul>
          </div>
          <p>If you're having trouble with the button above, copy and paste the URL into your web browser.</p>
          <p>Best regards,<br>Prayaas Team</p>
        </div>
        <div class="footer">
          <p>This is an automated message, please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} Prayaas. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    const text = `
Password Reset Request

You recently requested to reset your password for your Prayaas Admin account.

Reset your password by visiting this link:
${resetUrl}

This link will expire in 1 hour.

If you didn't request this reset, please ignore this email.

Best regards,
Prayaas Team
  `;

    return await sendEmail({
        to: email,
        subject: 'Password Reset Request - Prayaas Admin',
        html,
        text,
    });
}

/**
 * Send password change confirmation email
 */
export async function sendPasswordChangeConfirmation(email: string): Promise<boolean> {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #10B981; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
        .alert { background-color: #FEE2E2; border-left: 4px solid #EF4444; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✓ Password Changed Successfully</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>Your Prayaas Admin account password was successfully changed on ${new Date().toLocaleString()}.</p>
          <div class="alert">
            <strong>🔒 Didn't make this change?</strong>
            <p>If you didn't change your password, your account may be compromised. Please contact the system administrator immediately.</p>
          </div>
          <p>Best regards,<br>Prayaas Team</p>
        </div>
        <div class="footer">
          <p>This is an automated message, please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} Prayaas. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    const text = `
Password Changed Successfully

Your Prayaas Admin account password was successfully changed on ${new Date().toLocaleString()}.

If you didn't make this change, please contact the system administrator immediately.

Best regards,
Prayaas Team
  `;

    return await sendEmail({
        to: email,
        subject: 'Password Changed - Prayaas Admin',
        html,
        text,
    });
}
