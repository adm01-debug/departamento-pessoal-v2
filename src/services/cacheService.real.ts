// V19-S004: CacheService Real Expandido
interface CacheItem<T> { data: T; timestamp: number; ttl: number; }
const cache = new Map<string, CacheItem<unknown>>();
export const cacheServiceReal = {
  set<T>(key: string, data: T, ttlMs: number = 300000) {
    cache.set(key, { data, timestamp: Date.now(), ttl: ttlMs });
  },
  get<T>(key: string): T | null {
    const item = cache.get(key) as CacheItem<T> | undefined;
    if (!item) return null;
    if (Date.now() - item.timestamp > item.ttl) { cache.delete(key); return null; }
    return item.data;
  },
  has(key: string): boolean {
    const item = cache.get(key);
    if (!item) return false;
    if (Date.now() - item.timestamp > item.ttl) { cache.delete(key); return false; }
    return true;
  },
  delete(key: string) { cache.delete(key); },
  clear() { cache.clear(); },
  clearPattern(pattern: string) {
    const regex = new RegExp(pattern);
    cache.forEach((_, key) => { if (regex.test(key)) cache.delete(key); });
  },
  getStats() {
    return { size: cache.size, keys: Array.from(cache.keys()) };
  },
  async getOrFetch<T>(key: string, fetcher: () => Promise<T>, ttlMs?: number): Promise<T> {
    const cached = this.get<T>(key);
    if (cached) return cached;
    const data = await fetcher();
    this.set(key, data, ttlMs);
    return data;
  }
};
export default cacheServiceReal;
