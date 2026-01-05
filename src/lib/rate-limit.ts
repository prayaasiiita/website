/**
 * Rate Limiting Utility
 * Implements IP-based rate limiting to prevent spam and abuse
 * Uses in-memory storage for simplicity (suitable for single-instance deployments)
 * For multi-instance deployments, use Redis or a database-backed solution
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

// In-memory store for rate limiting
// Key: IP address, Value: { count, resetTime }
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 10 minutes to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitStore.entries()) {
        if (now > entry.resetTime) {
            rateLimitStore.delete(ip);
        }
    }
}, 10 * 60 * 1000);

export interface RateLimitConfig {
    /**
     * Maximum number of requests allowed within the window
     */
    maxRequests: number;
    /**
     * Time window in minutes
     */
    windowMinutes: number;
}

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetTime: number;
}

/**
 * Check if a request from the given IP is allowed
 * @param ip - IP address to check
 * @param config - Rate limit configuration
 * @returns RateLimitResult indicating if request is allowed
 */
export function checkRateLimit(
    ip: string,
    config: RateLimitConfig = { maxRequests: 5, windowMinutes: 60 }
): RateLimitResult {
    const now = Date.now();
    const windowMs = config.windowMinutes * 60 * 1000;

    const entry = rateLimitStore.get(ip);

    // No previous entry or window has expired - allow and create new entry
    if (!entry || now > entry.resetTime) {
        const resetTime = now + windowMs;
        rateLimitStore.set(ip, { count: 1, resetTime });
        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetTime,
        };
    }

    // Entry exists and window is still active
    if (entry.count < config.maxRequests) {
        // Under the limit - increment and allow
        entry.count++;
        rateLimitStore.set(ip, entry);
        return {
            allowed: true,
            remaining: config.maxRequests - entry.count,
            resetTime: entry.resetTime,
        };
    }

    // Over the limit - deny
    return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
    };
}

/**
 * Get remaining time until rate limit reset (in minutes)
 */
export function getRateLimitResetMinutes(resetTime: number): number {
    const remainingMs = resetTime - Date.now();
    return Math.ceil(remainingMs / (60 * 1000));
}

/**
 * Manually reset rate limit for an IP (useful for testing)
 */
export function resetRateLimitForIP(ip: string): void {
    rateLimitStore.delete(ip);
}
