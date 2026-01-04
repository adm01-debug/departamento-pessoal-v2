/**
 * upload utilities
 * @module lib/upload
 */

export const uploadConfig = { enabled: true, debug: false, timeout: 30000 };

export function configureupload(config: Partial<typeof uploadConfig>) {
  Object.assign(uploadConfig, config);
}

export function uploadInit(): boolean {
  console.log("[upload] Initialized");
  return true;
}

export function uploadProcess(data: any): any {
  if (!uploadConfig.enabled) return data;
  if (uploadConfig.debug) console.log("[upload] Processing:", data);
  return data;
}

export async function uploadAsync<T>(fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    if (uploadConfig.debug) console.log("[upload] Completed in", Date.now() - start, "ms");
    return result;
  } catch (error) {
    console.error("[upload] Error:", error);
    throw error;
  }
}

export function uploadValidate(value: unknown): boolean {
  return value !== null && value !== undefined;
}

export function uploadTransform<T, R>(data: T, transformer: (item: T) => R): R {
  return transformer(data);
}

export function uploadBatch<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}

export class uploadManager {
  private static instance: uploadManager;
  private data: Map<string, any> = new Map();

  static getInstance(): uploadManager {
    if (!uploadManager.instance) uploadManager.instance = new uploadManager();
    return uploadManager.instance;
  }

  set(key: string, value: any): void { this.data.set(key, value); }
  get(key: string): any { return this.data.get(key); }
  has(key: string): boolean { return this.data.has(key); }
  delete(key: string): boolean { return this.data.delete(key); }
  clear(): void { this.data.clear(); }
}

export default { configure: configureupload, init: uploadInit, process: uploadProcess, async: uploadAsync, validate: uploadValidate, transform: uploadTransform, batch: uploadBatch, Manager: uploadManager };
