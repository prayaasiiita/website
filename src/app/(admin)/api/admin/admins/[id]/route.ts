import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Admin, { AdminRole, Permission, DEFAULT_PERMISSIONS } from '@/src/models/Admin';
import { requireSuperAdmin, hashPassword } from '@/src/lib/auth';
import { createAuditLog } from '@/src/lib/audit';

/**
 * GET /api/admin/admins/[id]
 * Get a specific admin (Super Admin only)
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireSuperAdmin(request);
    if ('error' in authResult) return authResult.error;

    try {
        const { id } = await params;
        await dbConnect();

        const admin = await Admin.findById(id)
            .select('-password -resetPasswordToken -resetPasswordExpires')
            .lean();

        if (!admin) {
            return NextResponse.json(
                { error: 'Admin not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, admin });
    } catch (error) {
        console.error('Error fetching admin:', error);
        return NextResponse.json(
            { error: 'Failed to fetch admin' },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/admin/admins/[id]
 * Update an admin (Super Admin only)
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireSuperAdmin(request);
    if ('error' in authResult) return authResult.error;

    try {
        const { id } = await params;
        const body = await request.json();
        const { username, email, password, role, permissions, isActive } = body;

        await dbConnect();

        const admin = await Admin.findById(id);
        if (!admin) {
            return NextResponse.json(
                { error: 'Admin not found' },
                { status: 404 }
            );
        }

        // Prevent self-demotion from super_admin
        if (id === authResult.admin.userId && role && role !== 'super_admin') {
            return NextResponse.json(
                { error: 'Cannot demote yourself from super_admin' },
                { status: 400 }
            );
        }

        // Prevent deactivating yourself
        if (id === authResult.admin.userId && isActive === false) {
            return NextResponse.json(
                { error: 'Cannot deactivate yourself' },
                { status: 400 }
            );
        }

        // Capture before state
        const beforeState = {
            username: admin.username,
            email: admin.email,
            role: admin.role,
            isActive: admin.isActive,
        };

        // Update fields
        if (username) admin.username = username.trim();
        if (email) admin.email = email.toLowerCase().trim();
        if (password && password.length >= 8) {
            admin.password = await hashPassword(password);
            admin.lastPasswordChange = new Date();
        }
        if (role) {
            const validRoles: AdminRole[] = ['super_admin', 'coordinator', 'treasurer', 'admin'];
            if (validRoles.includes(role)) {
                admin.role = role as AdminRole;
                // If role changed and no custom permissions provided, use default
                if (!permissions) {
                    admin.permissions = DEFAULT_PERMISSIONS[role as AdminRole];
                }
            }
        }
        if (permissions) {
            admin.permissions = permissions as Permission[];
        }
        if (typeof isActive === 'boolean') {
            admin.isActive = isActive;
        }

        await admin.save();

        // Audit log
        createAuditLog({
            action: 'update',
            resource: 'admin',
            resourceId: id,
            admin: authResult.admin,
            request,
            changes: {
                before: beforeState,
                after: {
                    username: admin.username,
                    email: admin.email,
                    role: admin.role,
                    isActive: admin.isActive,
                },
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Admin updated successfully',
            admin: {
                _id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
                permissions: admin.permissions,
                isActive: admin.isActive,
            },
        });
    } catch (error) {
        console.error('Error updating admin:', error);
        return NextResponse.json(
            { error: 'Failed to update admin' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/admin/admins/[id]
 * Delete an admin (Super Admin only)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireSuperAdmin(request);
    if ('error' in authResult) return authResult.error;

    try {
        const { id } = await params;

        // Prevent self-deletion
        if (id === authResult.admin.userId) {
            return NextResponse.json(
                { error: 'Cannot delete yourself' },
                { status: 400 }
            );
        }

        await dbConnect();

        const admin = await Admin.findById(id);
        if (!admin) {
            return NextResponse.json(
                { error: 'Admin not found' },
                { status: 404 }
            );
        }

        await Admin.findByIdAndDelete(id);

        // Audit log
        createAuditLog({
            action: 'delete',
            resource: 'admin',
            resourceId: id,
            admin: authResult.admin,
            request,
            severity: 'warning',
            changes: {
                before: {
                    username: admin.username,
                    email: admin.email,
                    role: admin.role,
                },
                after: null,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Admin deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting admin:', error);
        return NextResponse.json(
            { error: 'Failed to delete admin' },
            { status: 500 }
        );
    }
}
