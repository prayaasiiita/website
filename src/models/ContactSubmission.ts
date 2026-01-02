import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface for ContactSubmission document
 * Represents a single contact form submission
 */
export interface IContactSubmission extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    ip: string;
    userAgent: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * ContactSubmission Schema
 * Stores all contact form submissions with metadata for tracking
 */
const ContactSubmissionSchema = new Schema<IContactSubmission>(
    {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
            maxlength: [50, 'First name cannot exceed 50 characters'],
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
            maxlength: [50, 'Last name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            maxlength: [255, 'Email cannot exceed 255 characters'],
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'Please provide a valid email address',
            ],
        },
        phone: {
            type: String,
            trim: true,
            maxlength: [20, 'Phone number cannot exceed 20 characters'],
        },
        subject: {
            type: String,
            required: [true, 'Subject is required'],
            enum: ['volunteer', 'donate', 'partnership', 'general', 'other'],
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
            trim: true,
            maxlength: [2000, 'Message cannot exceed 2000 characters'],
        },
        ip: {
            type: String,
            required: true,
        },
        userAgent: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Create indexes for better query performance
// Index on createdAt for sorting recent submissions
ContactSubmissionSchema.index({ createdAt: -1 });

// Compound index on email and createdAt for tracking user submissions
ContactSubmissionSchema.index({ email: 1, createdAt: -1 });

// Index on IP for rate limiting queries
ContactSubmissionSchema.index({ ip: 1, createdAt: -1 });

/**
 * Static method to find recent submissions by IP
 * Used for rate limiting
 */
ContactSubmissionSchema.statics.findRecentByIP = function (
    ip: string,
    minutesAgo: number = 60
) {
    const timeThreshold = new Date(Date.now() - minutesAgo * 60 * 1000);
    return this.find({
        ip,
        createdAt: { $gte: timeThreshold },
    }).countDocuments();
};

// Prevent model recompilation in development (Next.js hot reload)
const ContactSubmission: Model<IContactSubmission> =
    mongoose.models.ContactSubmission ||
    mongoose.model<IContactSubmission>('ContactSubmission', ContactSubmissionSchema);

export default ContactSubmission;
