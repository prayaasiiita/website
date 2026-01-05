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

/**
 * Data interface for contact form email
 */
export interface ContactFormEmailData {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

/**
 * Send contact form notification email to admin
 * This function runs asynchronously and doesn't block the form submission
 */
export async function sendContactFormEmail(data: ContactFormEmailData): Promise<boolean> {
    const subjectLabels: Record<string, string> = {
        volunteer: 'Volunteering Inquiry',
        donate: 'Donation Inquiry',
        partnership: 'Partnership Inquiry',
        general: 'General Inquiry',
        other: 'Other Inquiry',
    };

    const subjectLabel = subjectLabels[data.subject] || 'Contact Form Submission';

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; margin: 0; padding: 0; }
        .container { max-width: 650px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #e85a4f 0%, #c94a40 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: white; padding: 40px 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .field { margin-bottom: 25px; }
        .field-label { font-weight: 600; color: #555; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
        .field-value { background-color: #f8f9fa; padding: 12px 15px; border-radius: 6px; border-left: 3px solid #e85a4f; font-size: 15px; }
        .message-box { background-color: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; white-space: pre-wrap; font-size: 15px; line-height: 1.8; }
        .footer { text-align: center; margin-top: 30px; color: #999; font-size: 13px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
        .badge { display: inline-block; padding: 6px 12px; background-color: #e85a4f; color: white; border-radius: 12px; font-size: 12px; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px; font-weight: 600;">📬 New Contact Form Submission</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">${new Date().toLocaleString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          })}</p>
        </div>
        <div class="content">
          <div style="margin-bottom: 30px;">
            <span class="badge">${subjectLabel}</span>
          </div>
          
          <div class="field">
            <div class="field-label">Name</div>
            <div class="field-value">${data.firstName} ${data.lastName}</div>
          </div>

          <div class="field">
            <div class="field-label">Email Address</div>
            <div class="field-value"><a href="mailto:${data.email}" style="color: #e85a4f; text-decoration: none;">${data.email}</a></div>
          </div>

          ${data.phone ? `
          <div class="field">
            <div class="field-label">Phone Number</div>
            <div class="field-value"><a href="tel:${data.phone}" style="color: #e85a4f; text-decoration: none;">${data.phone}</a></div>
          </div>
          ` : ''}

          <div class="field">
            <div class="field-label">Message</div>
            <div class="message-box">${data.message}</div>
          </div>

          <div style="margin-top: 30px; padding: 20px; background-color: #f0f7ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <strong>💡 Quick Actions:</strong>
            <p style="margin: 10px 0 0 0;">Reply directly to this email to respond to ${data.firstName}.</p>
          </div>
        </div>
        <div class="footer">
          <p>This message was sent via the Prayaas contact form.</p>
          <p>&copy; ${new Date().getFullYear()} Prayaas IIITA. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    const text = `
New Contact Form Submission
${new Date().toLocaleString()}

Subject: ${subjectLabel}

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}

Message:
${data.message}

---
Reply to this email to respond to ${data.firstName}.
This message was sent via the Prayaas contact form.
  `;

    try {
        // Send email with replyTo set to user's email for easy responses
        await transporter.sendMail({
            from: process.env.SMTP_FROM || `"Prayaas Contact Form" <${process.env.SMTP_USER}>`,
            to: process.env.CONTACT_FORM_EMAIL || 'prayaas@iiita.ac.in',
            replyTo: `${data.firstName} ${data.lastName} <${data.email}>`,
            subject: `🔔 New ${subjectLabel} - ${data.firstName} ${data.lastName}`,
            html,
            text,
        });

        return true;
    } catch (error) {
        // Log error but don't throw - email sending should not block form submission
        console.error('Failed to send contact form email:', error);
        return false;
    }
}

/**
 * Send receipt/confirmation email to user who submitted the form
 * Confirms we received their message and will respond soon
 */
export async function sendContactFormReceipt(data: ContactFormEmailData): Promise<boolean> {
    const subjectLabels: Record<string, string> = {
        volunteer: 'Volunteering Inquiry',
        donate: 'Donation Inquiry',
        partnership: 'Partnership Inquiry',
        general: 'General Inquiry',
        other: 'Other Inquiry',
    };

    const subjectLabel = subjectLabels[data.subject] || 'Contact Form Submission';

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; margin: 0; padding: 0; }
        .container { max-width: 650px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #e85a4f 0%, #c94a40 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: white; padding: 40px 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .success-icon { font-size: 64px; margin-bottom: 20px; }
        .info-box { background-color: #f0f7ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 4px; }
        .message-copy { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e0e0e0; }
        .footer { text-align: center; margin-top: 30px; color: #999; font-size: 13px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
        .contact-info { margin-top: 20px; padding: 15px; background-color: #fff8f0; border-radius: 6px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="success-icon">✅</div>
          <h1 style="margin: 0; font-size: 28px; font-weight: 600;">Thank You for Contacting Us!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 15px;">We've received your message</p>
        </div>
        <div class="content">
          <p style="font-size: 16px; margin-bottom: 20px;">Dear ${data.firstName},</p>
          
          <p style="font-size: 15px; line-height: 1.8; color: #555;">
            Thank you for reaching out to <strong>Prayaas IIITA</strong>! We have successfully received your message regarding <strong>${subjectLabel}</strong>.
          </p>

          <div class="info-box">
            <strong>⏰ What happens next?</strong>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              <li>Our team will review your message within <strong>24 hours</strong></li>
              <li>We'll respond to you at <strong>${data.email}</strong></li>
              <li>For urgent matters, you can reach us at <strong>prayaas@iiita.ac.in</strong></li>
            </ul>
          </div>

          <div class="message-copy">
            <strong style="color: #555; font-size: 14px;">Your Message:</strong>
            <p style="margin-top: 10px; white-space: pre-wrap; color: #666;">${data.message}</p>
          </div>

          <div class="contact-info">
            <strong>📍 Visit Us:</strong>
            <p style="margin: 5px 0 0 0;">IIIT Allahabad, Jhalwa, Prayagraj<br>Uttar Pradesh 211015, India</p>
          </div>

          <p style="margin-top: 30px; font-size: 15px;">
            We appreciate your interest in Prayaas and look forward to connecting with you!
          </p>

          <p style="margin-top: 20px;">
            Warm regards,<br>
            <strong>The Prayaas Team</strong><br>
            IIIT Allahabad
          </p>
        </div>
        <div class="footer">
          <p>This is an automated confirmation email.</p>
          <p>&copy; ${new Date().getFullYear()} Prayaas IIITA. All rights reserved.</p>
          <p style="margin-top: 10px;">
            <a href="https://prayaas.iiita.ac.in" style="color: #e85a4f; text-decoration: none;">Visit Our Website</a> | 
            <a href="mailto:prayaas@iiita.ac.in" style="color: #e85a4f; text-decoration: none;">Email Us</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

    const text = `
Thank You for Contacting Prayaas IIITA!
==========================================

Dear ${data.firstName},

Thank you for reaching out to Prayaas IIITA! We have successfully received your message regarding ${subjectLabel}.

What happens next?
- Our team will review your message within 24 hours
- We'll respond to you at ${data.email}
- For urgent matters, you can reach us at prayaas@iiita.ac.in

Your Message:
${data.message}

Visit Us:
IIIT Allahabad, Jhalwa, Prayagraj
Uttar Pradesh 211015, India

We appreciate your interest in Prayaas and look forward to connecting with you!

Warm regards,
The Prayaas Team
IIIT Allahabad

---
This is an automated confirmation email.
© ${new Date().getFullYear()} Prayaas IIITA. All rights reserved.
  `;

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || `"Prayaas IIITA" <${process.env.SMTP_USER}>`,
            to: data.email,
            subject: `✓ We Received Your Message - ${subjectLabel}`,
            html,
            text,
        });

        return true;
    } catch (error) {
        console.error('Failed to send contact form receipt:', error);
        return false;
    }
}
