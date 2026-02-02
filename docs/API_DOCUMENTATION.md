# Prayaas Website API Documentation

Complete documentation for all API endpoints including authentication, authorization, request/response schemas, and examples.

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Admin Management](#2-admin-management)
3. [Events](#3-events)
4. [Volunteers](#4-volunteers)
5. [Empowerments](#5-empowerments)
6. [Tags](#6-tags)
7. [Content](#7-content)
8. [Team](#8-team)
9. [Contacts](#9-contacts)
10. [Site Settings](#10-site-settings)
11. [Page Images](#11-page-images)
12. [File Upload](#12-file-upload)
13. [Audit Logs](#13-audit-logs)
14. [Security Events](#14-security-events)

---

## Authentication Overview

All admin API endpoints require authentication via JWT token stored in an HTTP-only cookie named `admin_token`.

### Cookie Details
| Property | Value |
|----------|-------|
| Name | `admin_token` |
| HttpOnly | `true` |
| Secure | `true` (production) |
| SameSite | `strict` |
| Max-Age | `86400` (24 hours) |

### Role-Based Access Control (RBAC)

| Role | Description |
|------|-------------|
| `super_admin` | Full access to all features, can manage other admins |
| `coordinator` | Can manage events, volunteers, team, content, empowerments |
| `treasurer` | Can manage events and contacts, view audit logs |
| `admin` | Standard admin access to most features |

### Permission Types

| Permission | Description |
|------------|-------------|
| `manage_admins` | Create/update/delete admin users |
| `manage_roles` | Assign roles and permissions |
| `manage_events` | CRUD operations on events |
| `manage_volunteers` | CRUD operations on volunteers |
| `manage_team` | CRUD operations on team groups/members |
| `manage_content` | CRUD operations on page content |
| `manage_empowerments` | CRUD operations on empowerment stories |
| `manage_tags` | CRUD operations on tags |
| `manage_contacts` | View and delete contact submissions |
| `manage_settings` | Modify site settings |
| `manage_page_images` | CRUD operations on page images |
| `view_audit_logs` | View audit logs and security events |
| `manage_uploads` | Upload and delete files |

---

## 1. Authentication

### POST `/api/auth/login`
Authenticate an admin user.

**Rate Limit**: 5 requests per 15 minutes per IP

**Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "super_admin | coordinator | treasurer | admin"
  }
}
```

**Error Responses**:
- `400` - Missing username or password
- `401` - Invalid credentials
- `403` - Account is disabled
- `429` - Rate limit exceeded

---

### POST `/api/auth/logout`
Log out the current admin user.

**Authentication**: Required

**Success Response** (200):
```json
{
  "success": true
}
```

---

### GET `/api/auth/verify`
Verify the current admin session.

**Authentication**: Required

**Success Response** (200):
```json
{
  "authenticated": true,
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "string",
    "permissions": ["string"]
  }
}
```

**Error Response** (401):
```json
{
  "error": "Not authenticated"
}
```

---

### POST `/api/auth/change-password`
Change the current admin's password.

**Authentication**: Required
**Rate Limit**: 5 requests per 15 minutes

**Request Body**:
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 2. Admin Management

> **Note**: All admin management endpoints require `super_admin` role.

### GET `/api/admin/admins`
List all admin users.

**Permission**: `super_admin` only

**Success Response** (200):
```json
{
  "admins": [
    {
      "_id": "string",
      "username": "string",
      "email": "string",
      "role": "string",
      "permissions": ["string"],
      "isActive": true,
      "lastLogin": "ISO date string",
      "createdAt": "ISO date string"
    }
  ],
  "defaultPermissions": {
    "admin": ["manage_events", "..."],
    "coordinator": ["..."],
    "treasurer": ["..."],
    "super_admin": ["all"]
  }
}
```

---

### POST `/api/admin/admins`
Create a new admin user.

**Permission**: `super_admin` only

**Request Body**:
```json
{
  "username": "string (required)",
  "email": "string (required)",
  "password": "string (required, min 8 chars)",
  "role": "super_admin | coordinator | treasurer | admin",
  "permissions": ["string"],
  "isActive": true
}
```

**Success Response** (201):
```json
{
  "message": "Admin created successfully",
  "admin": { ... }
}
```

---

### GET `/api/admin/admins/:id`
Get a specific admin by ID.

**Permission**: `super_admin` only

**Success Response** (200):
```json
{
  "admin": { ... }
}
```

---

### PUT `/api/admin/admins/:id`
Update an admin user.

**Permission**: `super_admin` only

**Request Body** (all fields optional):
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "string",
  "permissions": ["string"],
  "isActive": true
}
```

**Error Cases**:
- `400` - Cannot demote yourself from super_admin
- `404` - Admin not found

---

### DELETE `/api/admin/admins/:id`
Delete an admin user.

**Permission**: `super_admin` only

**Error Cases**:
- `400` - Cannot delete yourself

---

## 3. Events

### GET `/api/admin/events`
List all events.

**Authentication**: Not required (public)

**Success Response** (200):
```json
{
  "events": [
    {
      "_id": "string",
      "title": "string",
      "description": "string",
      "image": "string (URL)",
      "date": "ISO date string",
      "type": "upcoming | completed"
    }
  ]
}
```

---

### POST `/api/admin/events`
Create a new event.

**Permission**: `manage_events`

**Request Body**:
```json
{
  "title": "string (required)",
  "description": "string",
  "image": "string (URL)",
  "date": "ISO date string (required)",
  "type": "upcoming | completed"
}
```

---

### PUT `/api/admin/events/:id`
Update an event.

**Permission**: `manage_events`

---

### DELETE `/api/admin/events/:id`
Delete an event.

**Permission**: `manage_events`

---

## 4. Volunteers

### GET `/api/admin/volunteers`
List all volunteer submissions.

**Authentication**: Required

**Query Parameters**:
| Param | Description |
|-------|-------------|
| `status` | Filter by status: `pending`, `approved`, `rejected` |
| `page` | Page number (default: 1) |
| `limit` | Items per page (default: 50) |

---

### PUT `/api/admin/volunteers/:id`
Update a volunteer record.

**Permission**: `manage_volunteers`

---

### DELETE `/api/admin/volunteers/:id`
Delete a volunteer record.

**Permission**: `manage_volunteers`

---

## 5. Empowerments

### GET `/api/admin/empowerments`
List empowerment stories with filtering.

**Authentication**: Optional (filters apply based on auth)

**Query Parameters**:
| Param | Description |
|-------|-------------|
| `status` | Filter by status: `draft`, `published` |
| `q` | Search query |
| `page` | Page number |
| `limit` | Items per page (max 100) |

---

### POST `/api/admin/empowerments`
Create an empowerment story.

**Permission**: `manage_empowerments`
**Rate Limit**: 20 requests per minute

**Request Body** (validated with Zod):
```json
{
  "title": "string (required)",
  "slug": "string (required, unique)",
  "shortDescription": "string",
  "content": "string (HTML/markdown)",
  "image": "string (URL)",
  "tags": ["ObjectId"],
  "status": "draft | published"
}
```

---

### PUT `/api/admin/empowerments/:id`
Update an empowerment story.

**Permission**: `manage_empowerments`

---

### DELETE `/api/admin/empowerments/:id`
Delete an empowerment story.

**Permission**: `manage_empowerments`

---

## 6. Tags

### GET `/api/admin/tags`
List all tags.

**Rate Limit**: 100 requests per minute

---

### POST `/api/admin/tags`
Create a new tag.

**Permission**: `manage_tags`

**Request Body**:
```json
{
  "name": "string (required, unique)",
  "color": "string (hex color)"
}
```

---

## 7. Content

### GET `/api/admin/content`
Get page content.

**Query Parameters**:
| Param | Description |
|-------|-------------|
| `section` | Filter by section name |

---

### POST `/api/admin/content`
Create content entry.

**Permission**: `manage_content`

**Request Body**:
```json
{
  "section": "string (required)",
  "key": "string (required)",
  "value": "string (required)",
  "type": "text | html | json"
}
```

---

### PUT `/api/admin/content`
Update content (upsert).

**Permission**: `manage_content`

---

## 8. Team

### GET `/api/team`
List team groups with members.

**Query Parameters**:
| Param | Description |
|-------|-------------|
| `includeHidden` | Include hidden groups/members |
| `type` | Filter by type: `executive`, `volunteer`, etc. |

---

### POST `/api/team`
Create a team group.

**Permission**: `manage_team`

**Request Body**:
```json
{
  "name": "string (required)",
  "description": "string",
  "type": "executive | volunteer | advisor | ...",
  "order": 0,
  "isVisible": true
}
```

---

### PUT `/api/team/:id`
Update a team group.

**Permission**: `manage_team`

---

### DELETE `/api/team/:id`
Delete a team group.

**Permission**: `manage_team`

---

## 9. Contacts

### GET `/api/admin/contacts`
List contact form submissions.

**Permission**: `manage_contacts`

**Success Response** (200):
```json
{
  "success": true,
  "contacts": [...],
  "total": 50
}
```

---

### DELETE `/api/admin/contacts/:id`
Delete a contact submission.

**Permission**: `manage_contacts`

---

## 10. Site Settings

### GET `/api/admin/site-settings`
Get site settings (admin).

**Authentication**: Required

---

### PUT `/api/admin/site-settings`
Update site settings.

**Permission**: `manage_settings`

**Request Body**:
```json
{
  "phone": "string",
  "phoneVisible": true,
  "email": "string",
  "emailVisible": true,
  "address": "string",
  "addressVisible": true
}
```

---

### GET `/api/site-settings` (Public)
Get public site settings (respects visibility).

---

## 11. Page Images

### GET `/api/admin/page-images`
List page images.

**Query Parameters**:
| Param | Description |
|-------|-------------|
| `page` | Page name filter |
| `section` | Section filter |

---

### POST `/api/admin/page-images`
Create/update a page image.

**Permission**: `manage_page_images`

---

### DELETE `/api/admin/page-images`
Delete a page image.

**Permission**: `manage_page_images`

---

## 12. File Upload

### POST `/api/upload`
Upload an image to Cloudinary.

**Permission**: `manage_uploads`

**Request**: `multipart/form-data`
| Field | Description |
|-------|-------------|
| `file` | Image file (JPEG, PNG, WebP, GIF) |
| `folder` | Subfolder (default: "team") |

**Constraints**:
- Max size: 5MB
- Allowed types: image/jpeg, image/png, image/webp, image/gif

**Success Response** (200):
```json
{
  "message": "Image uploaded successfully",
  "url": "https://...",
  "publicId": "...",
  "width": 500,
  "height": 500
}
```

---

### DELETE `/api/upload`
Delete an image from Cloudinary.

**Permission**: `manage_uploads`

**Query Parameters**:
| Param | Description |
|-------|-------------|
| `publicId` | Cloudinary public ID to delete |

---

## 13. Audit Logs

### GET `/api/admin/audit-logs`
Get audit logs with filtering.

**Permission**: `view_audit_logs`

**Query Parameters**:
| Param | Description |
|-------|-------------|
| `adminId` | Filter by admin ID |
| `resource` | Filter by resource type |
| `action` | Filter by action |
| `actorType` | Filter by actor: `admin`, `user`, `system` |
| `severity` | Filter by severity: `info`, `warning`, `error` |
| `status` | Filter by status: `success`, `failure` |
| `startDate` | Start date filter |
| `endDate` | End date filter |
| `page` | Page number |
| `limit` | Items per page |

**Success Response** (200):
```json
{
  "logs": [...],
  "total": 1234,
  "page": 1,
  "totalPages": 25
}
```

---

## 14. Security Events

### GET `/api/admin/security-events`
Get security-related events for dashboard.

**Permission**: `view_audit_logs`

**Query Parameters**:
| Param | Description |
|-------|-------------|
| `period` | Time period: `24h`, `7d`, `30d` |

**Success Response** (200):
```json
{
  "events": [...],
  "stats": {
    "failedLogins": 5,
    "rateLimits": 2,
    "unauthorizedAttempts": 0,
    "successfulLogins": 15
  },
  "severityDistribution": {
    "info": 100,
    "warning": 10,
    "error": 2
  },
  "hourlyLogins": [...],
  "period": "24h"
}
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request (validation error) |
| `401` | Unauthorized (not logged in) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Not Found |
| `409` | Conflict (duplicate entry) |
| `429` | Too Many Requests (rate limited) |
| `500` | Internal Server Error |

---

## Rate Limiting

Rate limits are applied per IP address:

| Endpoint | Limit |
|----------|-------|
| `/api/auth/login` | 5 per 15 minutes |
| `/api/auth/change-password` | 5 per 15 minutes |
| `/api/admin/empowerments` (write) | 20 per minute |
| `/api/admin/tags` (read) | 100 per minute |
| General API | 100 per minute |

When rate limited, the response includes:
- Status: `429`
- Header: `Retry-After: <seconds>`

---

## Security Headers

All API responses include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

Cache-Control headers are set appropriately:
- Admin endpoints: `no-store`
- Public endpoints: `public, s-maxage=<seconds>, stale-while-revalidate=<seconds>`
