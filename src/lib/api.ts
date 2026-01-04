/**
 * api utilities
 * @module lib/api
 */

export const apiConfig = { enabled: true, debug: false, timeout: 30000 };

export function configureapi(config: Partial<typeof apiConfig>) {
  Object.assign(apiConfig, config);
}

export function apiInit(): boolean {
  console.log("[api] Initialized");
  return true;
}

export function apiProcess(data: any): any {
  if (!apiConfig.enabled) return data;
  if (apiConfig.debug) console.log("[api] Processing:", data);
  return data;
}

export async function apiAsync<T>(fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    if (apiConfig.debug) console.log("[api] Completed in", Date.now() - start, "ms");
    return result;
  } catch (error) {
    console.error("[api] Error:", error);
    throw error;
  }
}

export function apiValidate(value: unknown): boolean {
  return value !== null && value !== undefined;
}

export function apiTransform<T, R>(data: T, transformer: (item: T) => R): R {
  return transformer(data);
}

export function apiBatch<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}

export class apiManager {
  private static instance: apiManager;
  private data: Map<string, any> = new Map();

  static getInstance(): apiManager {
    if (!apiManager.instance) apiManager.instance = new apiManager();
    return apiManager.instance;
  }

  set(key: string, value: any): void { this.data.set(key, value); }
  get(key: string): any { return this.data.get(key); }
  has(key: string): boolean { return this.data.has(key); }
  delete(key: string): boolean { return this.data.delete(key); }
  clear(): void { this.data.clear(); }
}

export default { configure: configureapi, init: apiInit, process: apiProcess, async: apiAsync, validate: apiValidate, transform: apiTransform, batch: apiBatch, Manager: apiManager };
