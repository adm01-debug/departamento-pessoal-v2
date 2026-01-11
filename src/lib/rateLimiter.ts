// V16-042: Rate Limiter Utility
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitState {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitState>();

export function createRateLimiter(config: RateLimitConfig) {
  return {
    check(key: string): { allowed: boolean; remaining: number; resetIn: number } {
      const now = Date.now();
      const state = store.get(key);

      if (!state || now > state.resetTime) {
        store.set(key, { count: 1, resetTime: now + config.windowMs });
        return { allowed: true, remaining: config.maxRequests - 1, resetIn: config.windowMs };
      }

      if (state.count >= config.maxRequests) {
        return { allowed: false, remaining: 0, resetIn: state.resetTime - now };
      }

      state.count++;
      return { allowed: true, remaining: config.maxRequests - state.count, resetIn: state.resetTime - now };
    },

    reset(key: string): void {
      store.delete(key);
    },
  };
}

// Pre-configured limiters
export const apiLimiter = createRateLimiter({ maxRequests: 100, windowMs: 60000 });
export const authLimiter = createRateLimiter({ maxRequests: 5, windowMs: 300000 });
export const exportLimiter = createRateLimiter({ maxRequests: 10, windowMs: 3600000 });
