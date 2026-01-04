/**
 * query utilities
 * @module lib/query
 */

export const queryConfig = { enabled: true, debug: false, timeout: 30000 };

export function configurequery(config: Partial<typeof queryConfig>) {
  Object.assign(queryConfig, config);
}

export function queryInit(): boolean {
  console.log("[query] Initialized");
  return true;
}

export function queryProcess(data: any): any {
  if (!queryConfig.enabled) return data;
  if (queryConfig.debug) console.log("[query] Processing:", data);
  return data;
}

export async function queryAsync<T>(fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    if (queryConfig.debug) console.log("[query] Completed in", Date.now() - start, "ms");
    return result;
  } catch (error) {
    console.error("[query] Error:", error);
    throw error;
  }
}

export function queryValidate(value: unknown): boolean {
  return value !== null && value !== undefined;
}

export function queryTransform<T, R>(data: T, transformer: (item: T) => R): R {
  return transformer(data);
}

export function queryBatch<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}

export class queryManager {
  private static instance: queryManager;
  private data: Map<string, any> = new Map();

  static getInstance(): queryManager {
    if (!queryManager.instance) queryManager.instance = new queryManager();
    return queryManager.instance;
  }

  set(key: string, value: any): void { this.data.set(key, value); }
  get(key: string): any { return this.data.get(key); }
  has(key: string): boolean { return this.data.has(key); }
  delete(key: string): boolean { return this.data.delete(key); }
  clear(): void { this.data.clear(); }
}

export default { configure: configurequery, init: queryInit, process: queryProcess, async: queryAsync, validate: queryValidate, transform: queryTransform, batch: queryBatch, Manager: queryManager };
