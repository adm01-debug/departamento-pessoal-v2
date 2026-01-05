const CACHE_PREFIX = "dp_cache_";
const DEFAULT_TTL = 3600000;
interface CacheItem<T> { data: T; expiry: number; }
export const cacheUtils = {
  set: <T>(key: string, data: T, ttl: number = DEFAULT_TTL): void => { const item: CacheItem<T> = { data, expiry: Date.now() + ttl }; try { localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item)); } catch (e) { console.warn("Cache storage failed", e); } },
  get: <T>(key: string): T | null => { try { const item = localStorage.getItem(CACHE_PREFIX + key); if (!item) return null; const parsed: CacheItem<T> = JSON.parse(item); if (Date.now() > parsed.expiry) { cacheUtils.remove(key); return null; } return parsed.data; } catch (e) { return null; } },
  remove: (key: string): void => { localStorage.removeItem(CACHE_PREFIX + key); },
  clear: (): void => { Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX)).forEach(k => localStorage.removeItem(k)); },
  has: (key: string): boolean => cacheUtils.get(key) !== null,
  getOrSet: async <T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> => { const cached = cacheUtils.get<T>(key); if (cached) return cached; const data = await fetcher(); cacheUtils.set(key, data, ttl); return data; },
};
export default cacheUtils;
