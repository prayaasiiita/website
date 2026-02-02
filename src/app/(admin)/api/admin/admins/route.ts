import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Admin, { AdminRole, Permission, DEFAULT_PERMISSIONS, ALL_PERMISSIONS } from '@/src/models/Admin';
import { requireSuperAdmin, hashPassword } from '@/src/lib/auth';
import { createAuditLog } from '@/src/lib/audit';

/**
 * GET /api/admin/admins
 * Get all admins (Super Admin only)
 */
export async function GET(request: NextRequest) {
    const authResult = await requireSuperAdmin(request);
    if ('error' in authResult) return authResult.error;

    try {
        await dbConnect();

        const admins = await Admin.find({})
            .select('-password -resetPasswordToken -resetPasswordExpires')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            admins,
            roles: ['super_admin', 'coordinator', 'treasurer', 'admin'] as AdminRole[],
            allPermissions: ALL_PERMISSIONS,
            defaultPermissions: DEFAULT_PERMISSIONS,
        });
    } catch (error) {
        console.error('Error fetching admins:', error);
        return NextResponse.json(
            { error: 'Failed to fetch admins' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/admin/admins
 * Create a new admin (Super Admin only)
 */
export async function POST(request: NextRequest) {
    const authResult = await requireSuperAdmin(request);
    if ('error' in authResult) return authResult.error;

    try {
        const body = await request.json();
        const { username, email, password, role, permissions } = body;

        // Validation
        if (!username || !email || !password) {
            return NextResponse.json(
                { error: 'Username, email, and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        const validRoles: AdminRole[] = ['super_admin', 'coordinator', 'treasurer', 'admin'];
        if (role && !validRoles.includes(role)) {
            return NextResponse.json(
                { error: 'Invalid role' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check if username or email already exists
        const existingAdmin = await Admin.findOne({
            $or: [{ username }, { email: email.toLowerCase() }]
        });

        if (existingAdmin) {
            return NextResponse.json(
                { error: 'Username or email already exists' },
                { status: 409 }
            );
        }

        const hashedPassword = await hashPassword(password);
        const adminRole: AdminRole = role || 'admin';
        const adminPermissions: Permission[] = permissions || DEFAULT_PERMISSIONS[adminRole];

        const newAdmin = await Admin.create({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: adminRole,
            permissions: adminPermissions,
            isActive: true,
            createdBy: authResult.admin.userId,
        });

        // Audit log
        createAuditLog({
            action: 'create',
            resource: 'admin',
            resourceId: newAdmin._id.toString(),
            admin: authResult.admin,
            request,
            changes: {
                after: {
                    username: newAdmin.username,
                    email: newAdmin.email,
                    role: newAdmin.role,
                },
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Admin created successfully',
            admin: {
                _id: newAdmin._id,
                username: newAdmin.username,
                email: newAdmin.email,
                role: newAdmin.role,
                permissions: newAdmin.permissions,
                isActive: newAdmin.isActive,
            },
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating admin:', error);
        return NextResponse.json(
            { error: 'Failed to create admin' },
            { status: 500 }
        );
    }
}
