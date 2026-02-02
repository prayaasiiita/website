import mongoose from 'mongoose';

export interface ISiteSettings extends mongoose.Document {
    phone: string;
    phoneVisible: boolean;
    email: string;
    emailVisible: boolean;
    address: string;
    addressVisible: boolean;
    updatedAt: Date;
    createdAt: Date;
}

const SiteSettingsSchema = new mongoose.Schema<ISiteSettings>(
    {
        phone: {
            type: String,
            default: '',
            trim: true,
        },
        phoneVisible: {
            type: Boolean,
            default: true,
        },
        email: {
            type: String,
            default: 'prayaas@iiita.ac.in',
            trim: true,
        },
        emailVisible: {
            type: Boolean,
            default: true,
        },
        address: {
            type: String,
            default: 'IIIT Allahabad, Jhalwa, Prayagraj, Uttar Pradesh 211015, India',
            trim: true,
        },
        addressVisible: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Ensure only one document exists (singleton pattern)
SiteSettingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
