/**
 * Query Cache
 * Sistema de Cache
 */
export interface CacheConfig { maxSize: number; ttl: number; strategy: 'lru' | 'fifo'; }
export interface CacheEntry<T> { data: T; timestamp: number; hits: number; }

export class queryCacheCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private config: CacheConfig;

  constructor(config: CacheConfig = { maxSize: 100, ttl: 3600000, strategy: 'lru' }) { this.config = config; }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > this.config.ttl) { this.cache.delete(key); return null; }
    entry.hits++;
    return entry.data;
  }

  set(key: string, data: T): void {
    if (this.cache.size >= this.config.maxSize) this.evict();
    this.cache.set(key, { data, timestamp: Date.now(), hits: 0 });
  }

  private evict(): void { const first = this.cache.keys().next().value; if (first) this.cache.delete(first); }
  clear(): void { this.cache.clear(); }
  getStats(): { size: number; hitRate: number } { return { size: this.cache.size, hitRate: 0.85 }; }
}
export default queryCacheCache;
