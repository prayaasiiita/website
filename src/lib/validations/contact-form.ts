import { z } from 'zod';

/**
 * Contact Form Validation Schema
 * Uses Zod for runtime type validation and error messages
 * Used on both client and server for consistent validation
 */
export const contactFormSchema = z.object({
    firstName: z
        .string()
        .min(1, 'First name is required')
        .max(50, 'First name cannot exceed 50 characters')
        .trim()
        .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),

    lastName: z
        .string()
        .min(1, 'Last name is required')
        .max(50, 'Last name cannot exceed 50 characters')
        .trim()
        .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),

    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please provide a valid email address')
        .max(255, 'Email cannot exceed 255 characters')
        .toLowerCase()
        .trim(),

    phone: z
        .string()
        .trim()
        .transform((val) => val === '' ? undefined : val)
        .optional()
        .refine(
            (val) => !val || /^[\d\s+()-]+$/.test(val),
            'Please provide a valid phone number'
        ),

    subject: z.enum(['volunteer', 'donate', 'partnership', 'general', 'other'], {
        message: 'Please select a valid subject',
    }),

    message: z
        .string()
        .min(10, 'Message must be at least 10 characters')
        .max(2000, 'Message cannot exceed 2000 characters')
        .trim(),
});

/**
 * Type inference for form data
 * Automatically derived from Zod schema
 */
export type ContactFormData = z.infer<typeof contactFormSchema>;
