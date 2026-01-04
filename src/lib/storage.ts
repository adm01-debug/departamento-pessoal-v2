/**
 * storage utilities
 * @module lib/storage
 */

export const storageConfig = { enabled: true, debug: false, timeout: 30000 };

export function configurestorage(config: Partial<typeof storageConfig>) {
  Object.assign(storageConfig, config);
}

export function storageInit(): boolean {
  console.log("[storage] Initialized");
  return true;
}

export function storageProcess(data: any): any {
  if (!storageConfig.enabled) return data;
  if (storageConfig.debug) console.log("[storage] Processing:", data);
  return data;
}

export async function storageAsync<T>(fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    if (storageConfig.debug) console.log("[storage] Completed in", Date.now() - start, "ms");
    return result;
  } catch (error) {
    console.error("[storage] Error:", error);
    throw error;
  }
}

export function storageValidate(value: unknown): boolean {
  return value !== null && value !== undefined;
}

export function storageTransform<T, R>(data: T, transformer: (item: T) => R): R {
  return transformer(data);
}

export function storageBatch<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}

export class storageManager {
  private static instance: storageManager;
  private data: Map<string, any> = new Map();

  static getInstance(): storageManager {
    if (!storageManager.instance) storageManager.instance = new storageManager();
    return storageManager.instance;
  }

  set(key: string, value: any): void { this.data.set(key, value); }
  get(key: string): any { return this.data.get(key); }
  has(key: string): boolean { return this.data.has(key); }
  delete(key: string): boolean { return this.data.delete(key); }
  clear(): void { this.data.clear(); }
}

export default { configure: configurestorage, init: storageInit, process: storageProcess, async: storageAsync, validate: storageValidate, transform: storageTransform, batch: storageBatch, Manager: storageManager };
