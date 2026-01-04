/**
 * cache utilities
 * @module lib/cache
 */

export const cacheConfig = { enabled: true, debug: false, timeout: 30000 };

export function configurecache(config: Partial<typeof cacheConfig>) {
  Object.assign(cacheConfig, config);
}

export function cacheInit(): boolean {
  console.log("[cache] Initialized");
  return true;
}

export function cacheProcess(data: any): any {
  if (!cacheConfig.enabled) return data;
  if (cacheConfig.debug) console.log("[cache] Processing:", data);
  return data;
}

export async function cacheAsync<T>(fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    if (cacheConfig.debug) console.log("[cache] Completed in", Date.now() - start, "ms");
    return result;
  } catch (error) {
    console.error("[cache] Error:", error);
    throw error;
  }
}

export function cacheValidate(value: unknown): boolean {
  return value !== null && value !== undefined;
}

export function cacheTransform<T, R>(data: T, transformer: (item: T) => R): R {
  return transformer(data);
}

export function cacheBatch<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}

export class cacheManager {
  private static instance: cacheManager;
  private data: Map<string, any> = new Map();

  static getInstance(): cacheManager {
    if (!cacheManager.instance) cacheManager.instance = new cacheManager();
    return cacheManager.instance;
  }

  set(key: string, value: any): void { this.data.set(key, value); }
  get(key: string): any { return this.data.get(key); }
  has(key: string): boolean { return this.data.has(key); }
  delete(key: string): boolean { return this.data.delete(key); }
  clear(): void { this.data.clear(); }
}

export default { configure: configurecache, init: cacheInit, process: cacheProcess, async: cacheAsync, validate: cacheValidate, transform: cacheTransform, batch: cacheBatch, Manager: cacheManager };
