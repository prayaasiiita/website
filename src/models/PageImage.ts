import mongoose from 'mongoose';

// Allowed pages and sections for validation
export const ALLOWED_PAGES = ['home', 'about', 'programs', 'gallery', 'impact', 'contact', 'get-involved'] as const;
export const ALLOWED_SECTIONS = [
    'hero',
    'about',
    'story',
    'mission',
    'programs',
    'education',
    'recreational',
    'lifeskills',
    'community',
    'team',
    'gallery',
    'testimonials',
    'cta',
    'features',
    'stats',
    'partners',
    'timeline',
    'contact',
    'events',
] as const;

export type PageType = typeof ALLOWED_PAGES[number];
export type SectionType = typeof ALLOWED_SECTIONS[number];

export interface IPageImage extends mongoose.Document {
    page: PageType;
    section: SectionType;
    key: string;
    imageUrl: string;
    publicId: string;
    alt: string;
    width?: number;
    height?: number;
    createdAt: Date;
    updatedAt: Date;
}

const PageImageSchema = new mongoose.Schema<IPageImage>(
    {
        page: {
            type: String,
            required: [true, 'Page is required'],
            enum: {
                values: ALLOWED_PAGES,
                message: 'Invalid page: {VALUE}',
            },
            trim: true,
            lowercase: true,
        },
        section: {
            type: String,
            required: [true, 'Section is required'],
            enum: {
                values: ALLOWED_SECTIONS,
                message: 'Invalid section: {VALUE}',
            },
            trim: true,
            lowercase: true,
        },
        key: {
            type: String,
            required: [true, 'Key is required'],
            trim: true,
            lowercase: true,
            maxlength: [100, 'Key cannot exceed 100 characters'],
        },
        imageUrl: {
            type: String,
            required: [true, 'Image URL is required'],
            validate: {
                validator: (v: string) => /^https:\/\/res\.cloudinary\.com\/.+/.test(v),
                message: 'Invalid Cloudinary URL',
            },
        },
        publicId: {
            type: String,
            required: [true, 'Public ID is required'],
            trim: true,
        },
        alt: {
            type: String,
            required: [true, 'Alt text is required for accessibility'],
            trim: true,
            maxlength: [200, 'Alt text cannot exceed 200 characters'],
        },
        width: {
            type: Number,
            min: 0,
        },
        height: {
            type: Number,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Compound unique index for page + section + key
PageImageSchema.index({ page: 1, section: 1, key: 1 }, { unique: true });

// Index for efficient querying by page
PageImageSchema.index({ page: 1 });

// Static method to get images by page
PageImageSchema.statics.getByPage = function (page: PageType) {
    return this.find({ page }).sort({ section: 1, key: 1 });
};

// Static method to get single image
PageImageSchema.statics.getImage = function (page: PageType, section: SectionType, key: string) {
    return this.findOne({ page, section, key });
};

export default mongoose.models.PageImage || mongoose.model<IPageImage>('PageImage', PageImageSchema);
