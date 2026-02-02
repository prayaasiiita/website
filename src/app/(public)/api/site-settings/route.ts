import { NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import SiteSettings from '@/src/models/SiteSettings';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds as fallback

// GET - Fetch public site settings (respects visibility toggles)
export async function GET() {
    try {
        await dbConnect();

        // Get or create settings
        let settings = await SiteSettings.findOne().lean();
        if (!settings) {
            const created = await SiteSettings.create({});
            settings = created.toObject();
        }

        // Return only visible contact info
        const publicSettings = {
            phone: settings.phoneVisible ? settings.phone : null,
            phoneVisible: settings.phoneVisible,
            email: settings.emailVisible ? settings.email : null,
            emailVisible: settings.emailVisible,
            address: settings.addressVisible ? settings.address : null,
            addressVisible: settings.addressVisible,
        };

        return NextResponse.json({ settings: publicSettings }, { status: 200 });
    } catch (error) {
        console.error('Get public site settings error:', error);
        return NextResponse.json({ error: 'Failed to fetch site settings' }, { status: 500 });
    }
}
