const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  windowMs?: number;  // Time window in milliseconds (default: 60s)
  max?: number;       // Max requests per window (default: 60)
}

export function rateLimit(identifier: string, config: RateLimitConfig = {}): { success: boolean; remaining: number; resetIn: number } {
  const { windowMs = 60_000, max = 60 } = config;
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  // Clean up expired entries periodically
  if (rateLimitMap.size > 10_000) {
    for (const [key, val] of rateLimitMap) {
      if (now > val.resetTime) rateLimitMap.delete(key);
    }
  }

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: max - 1, resetIn: windowMs };
  }

  if (entry.count >= max) {
    return { success: false, remaining: 0, resetIn: entry.resetTime - now };
  }

  entry.count++;
  return { success: true, remaining: max - entry.count, resetIn: entry.resetTime - now };
}

export function rateLimitHeaders(result: { remaining: number; resetIn: number }): HeadersInit {
  return {
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetIn / 1000)),
  };
}
