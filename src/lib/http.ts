/**
 * http utilities
 * @module lib/http
 */

export const httpConfig = { enabled: true, debug: false, timeout: 30000 };

export function configurehttp(config: Partial<typeof httpConfig>) {
  Object.assign(httpConfig, config);
}

export function httpInit(): boolean {
  console.log("[http] Initialized");
  return true;
}

export function httpProcess(data: any): any {
  if (!httpConfig.enabled) return data;
  if (httpConfig.debug) console.log("[http] Processing:", data);
  return data;
}

export async function httpAsync<T>(fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    if (httpConfig.debug) console.log("[http] Completed in", Date.now() - start, "ms");
    return result;
  } catch (error) {
    console.error("[http] Error:", error);
    throw error;
  }
}

export function httpValidate(value: unknown): boolean {
  return value !== null && value !== undefined;
}

export function httpTransform<T, R>(data: T, transformer: (item: T) => R): R {
  return transformer(data);
}

export function httpBatch<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}

export class httpManager {
  private static instance: httpManager;
  private data: Map<string, any> = new Map();

  static getInstance(): httpManager {
    if (!httpManager.instance) httpManager.instance = new httpManager();
    return httpManager.instance;
  }

  set(key: string, value: any): void { this.data.set(key, value); }
  get(key: string): any { return this.data.get(key); }
  has(key: string): boolean { return this.data.has(key); }
  delete(key: string): boolean { return this.data.delete(key); }
  clear(): void { this.data.clear(); }
}

export default { configure: configurehttp, init: httpInit, process: httpProcess, async: httpAsync, validate: httpValidate, transform: httpTransform, batch: httpBatch, Manager: httpManager };
