/**
 * download utilities
 * @module lib/download
 */

export const downloadConfig = { enabled: true, debug: false, timeout: 30000 };

export function configuredownload(config: Partial<typeof downloadConfig>) {
  Object.assign(downloadConfig, config);
}

export function downloadInit(): boolean {
  console.log("[download] Initialized");
  return true;
}

export function downloadProcess(data: any): any {
  if (!downloadConfig.enabled) return data;
  if (downloadConfig.debug) console.log("[download] Processing:", data);
  return data;
}

export async function downloadAsync<T>(fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    if (downloadConfig.debug) console.log("[download] Completed in", Date.now() - start, "ms");
    return result;
  } catch (error) {
    console.error("[download] Error:", error);
    throw error;
  }
}

export function downloadValidate(value: unknown): boolean {
  return value !== null && value !== undefined;
}

export function downloadTransform<T, R>(data: T, transformer: (item: T) => R): R {
  return transformer(data);
}

export function downloadBatch<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}

export class downloadManager {
  private static instance: downloadManager;
  private data: Map<string, any> = new Map();

  static getInstance(): downloadManager {
    if (!downloadManager.instance) downloadManager.instance = new downloadManager();
    return downloadManager.instance;
  }

  set(key: string, value: any): void { this.data.set(key, value); }
  get(key: string): any { return this.data.get(key); }
  has(key: string): boolean { return this.data.has(key); }
  delete(key: string): boolean { return this.data.delete(key); }
  clear(): void { this.data.clear(); }
}

export default { configure: configuredownload, init: downloadInit, process: downloadProcess, async: downloadAsync, validate: downloadValidate, transform: downloadTransform, batch: downloadBatch, Manager: downloadManager };
