/**
 * Security utilities for input validation and sanitization
 */

// Email validation
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.toLowerCase().trim());
}

// Sanitize string inputs
export function sanitizeString(input: string, maxLength: number = 500): string {
    return input.trim().slice(0, maxLength);
}

// Validate URL
export function isValidUrl(url: string): boolean {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
        return false;
    }
}

// Sanitize HTML to prevent XSS
export function sanitizeHtml(html: string): string {
    return html
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

// Validate MongoDB ObjectId
export function isValidObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
}

// Rate limiter for API routes
class RateLimiter {
    private requests: Map<string, { count: number; resetTime: number }>;
    private maxRequests: number;
    private windowMs: number;

    constructor(maxRequests: number = 60, windowMs: number = 60000) {
        this.requests = new Map();
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
    }

    check(identifier: string): { allowed: boolean; remaining: number } {
        const now = Date.now();
        const record = this.requests.get(identifier);

        if (!record || now > record.resetTime) {
            this.requests.set(identifier, { count: 1, resetTime: now + this.windowMs });
            return { allowed: true, remaining: this.maxRequests - 1 };
        }

        if (record.count >= this.maxRequests) {
            return { allowed: false, remaining: 0 };
        }

        record.count++;
        return { allowed: true, remaining: this.maxRequests - record.count };
    }

    /**
     * Check rate limit with custom parameters
     * @param identifier - IP address or user identifier
     * @param maxRequests - Maximum requests allowed (defaults to instance maxRequests)
     * @param windowMs - Time window in milliseconds (defaults to instance windowMs)
     */
    checkLimit(identifier: string, maxRequests?: number, windowMs?: number): boolean {
        const now = Date.now();
        const record = this.requests.get(identifier);
        const max = maxRequests || this.maxRequests;
        const window = windowMs || this.windowMs;

        if (!record || now > record.resetTime) {
            this.requests.set(identifier, { count: 1, resetTime: now + window });
            return true;
        }

        if (record.count >= max) {
            return false;
        }

        record.count++;
        return true;
    }

    reset(identifier: string): void {
        this.requests.delete(identifier);
    }
}

// Export rate limiter instances for different routes
export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 requests per 15 minutes
export const apiRateLimiter = new RateLimiter(100, 60 * 1000); // 100 requests per minute
export const uploadRateLimiter = new RateLimiter(20, 60 * 1000); // 20 uploads per minute

// Validate file upload
export function validateFileUpload(
    file: File,
    allowedTypes: string[],
    maxSizeBytes: number
): { valid: boolean; error?: string } {
    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'Invalid file type' };
    }

    if (file.size > maxSizeBytes) {
        return { valid: false, error: `File too large. Maximum size is ${maxSizeBytes / (1024 * 1024)}MB` };
    }

    return { valid: true };
}

// Content Security Policy headers
export const CSP_HEADER = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-eval
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://res.cloudinary.com https://api.cloudinary.com",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
].join('; ');

// Security headers object
export const SECURITY_HEADERS = {
    'X-DNS-Prefetch-Control': 'on',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': CSP_HEADER,
};

// Extract IP address from request
export function getClientIp(headers: Headers): string {
    const forwarded = headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    const realIp = headers.get('x-real-ip');
    if (realIp) {
        return realIp.trim();
    }

    return 'unknown';
}
