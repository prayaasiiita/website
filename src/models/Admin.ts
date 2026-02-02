import mongoose from 'mongoose';

// RBAC Role Types
export type AdminRole = 'super_admin' | 'coordinator' | 'treasurer' | 'admin';

// Available Permissions
export type Permission =
  | 'manage_admins'        // Create/edit/delete admin users (super_admin only)
  | 'manage_roles'         // Assign roles and permissions (super_admin only)
  | 'manage_events'        // CRUD on events
  | 'manage_volunteers'    // CRUD on volunteers
  | 'manage_team'          // CRUD on team members/groups
  | 'manage_content'       // Edit site content
  | 'manage_empowerments'  // CRUD on empowerment stories
  | 'manage_tags'          // CRUD on tags
  | 'manage_contacts'      // View/delete contact submissions
  | 'manage_settings'      // Edit site settings
  | 'manage_page_images'   // Upload/edit page images
  | 'manage_gallery'       // Manage Flickr gallery albums
  | 'view_audit_logs'      // View audit logs
  | 'manage_uploads';      // Upload/delete files

// All available permissions
export const ALL_PERMISSIONS: Permission[] = [
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
  'manage_gallery',
  'view_audit_logs',
  'manage_uploads',
];

// Default permissions by role (can be customized by super_admin)
export const DEFAULT_PERMISSIONS: Record<AdminRole, Permission[]> = {
  super_admin: ALL_PERMISSIONS,
  coordinator: [
    'manage_events',
    'manage_volunteers',
    'manage_team',
    'manage_content',
    'manage_empowerments',
    'manage_tags',
    'manage_contacts',
    'manage_page_images',
    'manage_gallery',
    'manage_uploads',
  ],
  treasurer: [
    'manage_events',
    'manage_contacts',
    'view_audit_logs',
  ],
  admin: [
    'manage_events',
    'manage_volunteers',
    'manage_content',
    'manage_empowerments',
    'manage_tags',
    'manage_contacts',
    'manage_gallery',
    'manage_uploads',
  ],
};

export interface IAdmin extends mongoose.Document {
  username: string;
  password: string;
  email: string;
  role: AdminRole;
  permissions: Permission[];
  isActive: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastPasswordChange?: Date;
  lastLogin?: Date;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new mongoose.Schema<IAdmin>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ['super_admin', 'coordinator', 'treasurer', 'admin'],
      default: 'admin',
    },
    permissions: {
      type: [String],
      default: function (this: IAdmin) {
        // Default to role's default permissions
        return DEFAULT_PERMISSIONS[this.role] || DEFAULT_PERMISSIONS.admin;
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: {
      type: String,
      select: false, // Don't include in queries by default
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    lastPasswordChange: {
      type: Date,
    },
    lastLogin: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
AdminSchema.index({ role: 1 });
AdminSchema.index({ isActive: 1 });

// Helper method to check if admin has a specific permission
AdminSchema.methods.hasPermission = function (permission: Permission): boolean {
  // Super admin always has all permissions
  if (this.role === 'super_admin') return true;
  return this.permissions.includes(permission);
};

// Helper method to check if admin has any of the specified permissions
AdminSchema.methods.hasAnyPermission = function (permissions: Permission[]): boolean {
  if (this.role === 'super_admin') return true;
  return permissions.some(p => this.permissions.includes(p));
};

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
