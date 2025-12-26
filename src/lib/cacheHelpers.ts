const cache = new Map<string, { data: any; expires: number }>();
export const cacheGet = <T>(key: string): T | null => { const item = cache.get(key); if (!item || Date.now() > item.expires) { cache.delete(key); return null; } return item.data; };
export const cacheSet = <T>(key: string, data: T, ttl = 60000) => cache.set(key, { data, expires: Date.now() + ttl });
export const cacheClear = (key?: string) => key ? cache.delete(key) : cache.clear();
