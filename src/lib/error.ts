/**
 * error utilities
 * @module lib/error
 */

export const errorConfig = { enabled: true, debug: false, timeout: 30000 };

export function configureerror(config: Partial<typeof errorConfig>) {
  Object.assign(errorConfig, config);
}

export function errorInit(): boolean {
  console.log("[error] Initialized");
  return true;
}

export function errorProcess(data: any): any {
  if (!errorConfig.enabled) return data;
  if (errorConfig.debug) console.log("[error] Processing:", data);
  return data;
}

export async function errorAsync<T>(fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    if (errorConfig.debug) console.log("[error] Completed in", Date.now() - start, "ms");
    return result;
  } catch (error) {
    console.error("[error] Error:", error);
    throw error;
  }
}

export function errorValidate(value: unknown): boolean {
  return value !== null && value !== undefined;
}

export function errorTransform<T, R>(data: T, transformer: (item: T) => R): R {
  return transformer(data);
}

export function errorBatch<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}

export class errorManager {
  private static instance: errorManager;
  private data: Map<string, any> = new Map();

  static getInstance(): errorManager {
    if (!errorManager.instance) errorManager.instance = new errorManager();
    return errorManager.instance;
  }

  set(key: string, value: any): void { this.data.set(key, value); }
  get(key: string): any { return this.data.get(key); }
  has(key: string): boolean { return this.data.has(key); }
  delete(key: string): boolean { return this.data.delete(key); }
  clear(): void { this.data.clear(); }
}

export default { configure: configureerror, init: errorInit, process: errorProcess, async: errorAsync, validate: errorValidate, transform: errorTransform, batch: errorBatch, Manager: errorManager };
