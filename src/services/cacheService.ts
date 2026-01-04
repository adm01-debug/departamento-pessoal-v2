export interface CacheEntry<T = any> {
  key: string;
  value: T;
  expiresAt: number;
  createdAt: number;
  hits: number;
  tags?: string[];
}

export interface CacheConfig {
  defaultTTL?: number;
  maxSize?: number;
  cleanupInterval?: number;
}

class CacheService {
  private cache: Map<string, CacheEntry> = new Map();
  private config: CacheConfig = {
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxSize: 1000,
    cleanupInterval: 60 * 1000, // 1 minute
  };
  private cleanupTimer?: NodeJS.Timeout;

  constructor() {
    this.startCleanup();
  }

  configure(config: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...config };
    this.startCleanup();
  }

  private startCleanup(): void {
    if (this.cleanupTimer) clearInterval(this.cleanupTimer);
    if (typeof window !== "undefined") {
      this.cleanupTimer = setInterval(() => this.cleanup(), this.config.cleanupInterval);
    }
  }

  set<T>(key: string, value: T, ttl?: number, tags?: string[]): void {
    if (this.cache.size >= (this.config.maxSize || 1000)) {
      this.evictOldest();
    }

    const entry: CacheEntry<T> = {
      key,
      value,
      expiresAt: Date.now() + (ttl || this.config.defaultTTL || 300000),
      createdAt: Date.now(),
      hits: 0,
      tags,
    };

    this.cache.set(key, entry);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    entry.hits++;
    return entry.value as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  clearByTag(tag: string): number {
    let count = 0;
    this.cache.forEach((entry, key) => {
      if (entry.tags?.includes(tag)) {
        this.cache.delete(key);
        count++;
      }
    });
    return count;
  }

  clearByPattern(pattern: string): number {
    const regex = new RegExp(pattern);
    let count = 0;
    this.cache.forEach((_, key) => {
      if (regex.test(key)) {
        this.cache.delete(key);
        count++;
      }
    });
    return count;
  }

  async getOrSet<T>(key: string, factory: () => Promise<T>, ttl?: number, tags?: string[]): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) return cached;
    const value = await factory();
    this.set(key, value, ttl, tags);
    return value;
  }

  private cleanup(): void {
    const now = Date.now();
    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    });
  }

  private evictOldest(): void {
    let oldest: string | null = null;
    let oldestTime = Infinity;
    this.cache.forEach((entry, key) => {
      if (entry.createdAt < oldestTime) {
        oldestTime = entry.createdAt;
        oldest = key;
      }
    });
    if (oldest) this.cache.delete(oldest);
  }

  getStats(): { size: number; hits: number; keys: string[] } {
    let totalHits = 0;
    const keys: string[] = [];
    this.cache.forEach((entry, key) => {
      totalHits += entry.hits;
      keys.push(key);
    });
    return { size: this.cache.size, hits: totalHits, keys };
  }

  getEntry(key: string): CacheEntry | null {
    return this.cache.get(key) || null;
  }

  touch(key: string, ttl?: number): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    entry.expiresAt = Date.now() + (ttl || this.config.defaultTTL || 300000);
    return true;
  }
}

export const cacheService = new CacheService();
export default cacheService;
