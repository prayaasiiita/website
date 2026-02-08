/**
 * Script to upgrade an admin to super_admin
 * Usage: npx ts-node scripts/make-super-admin.ts <username>
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const ALL_PERMISSIONS = [
    'manage_admins',
    'manage_roles',
    'manage_events',
    'manage_volunteers',
    'manage_team',
    'manage_content',
    'manage_empowerments',
    'manage_tags',
    'manage_contacts',
    'manage_settings',
    'manage_page_images',
    'view_audit_logs',
    'manage_uploads',
];

async function makeSuperAdmin() {
    const username = process.argv[2];

    if (!username) {
        console.log('Usage: npx ts-node scripts/make-super-admin.ts <username>');
        console.log('Example: npx ts-node scripts/make-super-admin.ts admin');
        process.exit(1);
    }

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error('MONGODB_URI not found in .env.local');
        process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);

    const result = await mongoose.connection.db?.collection('admins').updateOne(
        { username },
        {
            $set: {
                role: 'super_admin',
                permissions: ALL_PERMISSIONS,
                isActive: true,
            },
        }
    );

    if (result?.matchedCount === 0) {
        console.error(`Admin with username "${username}" not found`);
    } else if (result?.modifiedCount === 1) {
        console.log(`✅ Successfully upgraded "${username}" to super_admin!`);
        console.log('Permissions granted:', ALL_PERMISSIONS.join(', '));
    } else {
        console.log(`Admin "${username}" is already a super_admin`);
    }

    await mongoose.disconnect();
    process.exit(0);
}

makeSuperAdmin().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
});
