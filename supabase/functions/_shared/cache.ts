// MP-032: Cache-Control helper for read-only Edge Function responses.
// Usage: return jsonResponse(data, { cache: cachePublic(300) });

export interface CachePolicy {
  'Cache-Control': string;
  Vary?: string;
}

/** Public CDN-cacheable response for anonymous read-only endpoints. */
export function cachePublic(sMaxAgeSeconds: number, staleWhileRevalidate = 60): CachePolicy {
  return {
    'Cache-Control': `public, max-age=0, s-maxage=${sMaxAgeSeconds}, stale-while-revalidate=${staleWhileRevalidate}`,
    Vary: 'Accept-Encoding, Origin',
  };
}

/** Private per-user cache (browser only). */
export function cachePrivate(maxAgeSeconds: number): CachePolicy {
  return {
    'Cache-Control': `private, max-age=${maxAgeSeconds}`,
    Vary: 'Accept-Encoding, Authorization',
  };
}

/** No caching (default for mutations and sensitive data). */
export function cacheNone(): CachePolicy {
  return { 'Cache-Control': 'no-store, no-cache, must-revalidate, private' };
}

/** ETag builder for conditional GET support. */
export async function computeETag(payload: unknown): Promise<string> {
  const data = new TextEncoder().encode(JSON.stringify(payload));
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hex = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `"${hex.slice(0, 32)}"`;
}
