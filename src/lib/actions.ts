'use server';

/**
 * Contact Form Server Action
 * Handles form submission securely on the server
 * Includes validation, rate limiting, database storage, and email notification
 */

import { headers } from 'next/headers';
import dbConnect from '@/src/lib/mongodb';
import ContactSubmission from '@/src/models/ContactSubmission';
import { contactFormSchema, type ContactFormData } from '@/src/lib/validations/contact-form';
import { checkRateLimit, getRateLimitResetMinutes } from '@/src/lib/rate-limit';
import { sendContactFormEmail, sendContactFormReceipt } from '@/src/lib/email';

/**
 * Result interface for form submission
 */
export interface SubmitContactFormResult {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
}

/**
 * Get client IP address from headers
 * Handles various proxy configurations
 */
async function getClientIP(): Promise<string> {
    const headersList = await headers();

    // Check common proxy headers in order of priority
    const forwardedFor = headersList.get('x-forwarded-for');
    if (forwardedFor) {
        // x-forwarded-for can contain multiple IPs, take the first one
        return forwardedFor.split(',')[0].trim();
    }

    const realIP = headersList.get('x-real-ip');
    if (realIP) {
        return realIP.trim();
    }

    // Fallback to connection remote address (less reliable in production)
    return 'unknown';
}

/**
 * Get user agent from headers
 */
async function getUserAgent(): Promise<string> {
    const headersList = await headers();
    return headersList.get('user-agent') || 'unknown';
}

/**
 * Sanitize string input
 * Trims whitespace and prevents excessively long strings
 */
function sanitizeString(str: string, maxLength: number = 1000): string {
    return str.trim().slice(0, maxLength);
}

/**
 * Submit contact form
 * Main server action called from the client component
 */
export async function submitContactForm(
    formData: ContactFormData
): Promise<SubmitContactFormResult> {
    try {
        // Get client metadata
        const ip = await getClientIP();
        const userAgent = await getUserAgent();

        // Rate limiting check (5 submissions per hour per IP)
        const rateLimitResult = checkRateLimit(ip, {
            maxRequests: 5,
            windowMinutes: 60,
        });

        if (!rateLimitResult.allowed) {
            const resetMinutes = getRateLimitResetMinutes(rateLimitResult.resetTime);
            return {
                success: false,
                message: `Too many requests. Please try again in ${resetMinutes} minute${resetMinutes !== 1 ? 's' : ''}.`,
            };
        }

        // Server-side validation using Zod
        const validationResult = contactFormSchema.safeParse(formData);

        if (!validationResult.success) {
            // Format validation errors for client
            const errors: Record<string, string[]> = {};
            validationResult.error.issues.forEach((error) => {
                const field = error.path[0] as string;
                if (!errors[field]) {
                    errors[field] = [];
                }
                errors[field].push(error.message);
            });

            return {
                success: false,
                message: 'Please check the form for errors.',
                errors,
            };
        }

        const validatedData = validationResult.data;

        // Sanitize all string inputs as an extra security measure
        const sanitizedData = {
            firstName: sanitizeString(validatedData.firstName, 50),
            lastName: sanitizeString(validatedData.lastName, 50),
            email: sanitizeString(validatedData.email, 255),
            phone: validatedData.phone ? sanitizeString(validatedData.phone, 20) : undefined,
            subject: validatedData.subject,
            message: sanitizeString(validatedData.message, 2000),
        };

        // Connect to database
        await dbConnect();

        // Save submission to database
        const submission = await ContactSubmission.create({
            ...sanitizedData,
            ip,
            userAgent,
        });

        // Audit log the form submission (non-blocking, imported dynamically to avoid circular deps)
        import('./audit-helpers').then(({ auditFormSubmission }) => {
            auditFormSubmission({
                formType: 'contact_form',
                submitterId: submission._id.toString(),
                submitterEmail: sanitizedData.email,
                ipAddress: ip,
                userAgent,
                success: true,
                metadata: {
                    subject: sanitizedData.subject,
                    firstName: sanitizedData.firstName,
                },
            });
        }).catch(() => {
            // Form submission audit is optional
        });

        console.log('Contact form submitted successfully:', {
            id: submission._id,
            email: sanitizedData.email,
            subject: sanitizedData.subject,
            ip,
        });

        // Send emails asynchronously (non-blocking)
        // Email failures should not cause form submission to fail
        Promise.all([
            // Send notification to admin
            sendContactFormEmail(sanitizedData).then((emailSent) => {
                if (emailSent) {
                    console.log('Contact form notification sent to admin');
                } else {
                    console.warn('Admin notification email not sent (email may not be configured)');
                }
            }),
            // Send receipt to user
            sendContactFormReceipt(sanitizedData).then((receiptSent) => {
                if (receiptSent) {
                    console.log('Receipt email sent to user:', sanitizedData.email);
                } else {
                    console.warn('Receipt email not sent (email may not be configured)');
                }
            }),
        ]).catch((error) => {
            // Log error but don't propagate - email sending is non-critical
            console.error('Error sending emails:', error);
        });

        return {
            success: true,
            message: 'Thank you for your message! We\'ll get back to you within 24 hours. Check your email for a confirmation.',
        };
    } catch (error) {
        // Log error for debugging but don't expose internal details to client
        console.error('Contact form submission error:', error);

        // Check if it's a database validation error
        if (error instanceof Error && error.name === 'ValidationError') {
            return {
                success: false,
                message: 'Invalid form data. Please check your inputs and try again.',
            };
        }

        // Generic error message for any other errors
        return {
            success: false,
            message: 'An unexpected error occurred. Please try again later.',
        };
    }
}
