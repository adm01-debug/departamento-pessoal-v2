/**
 * throttle utilities
 * @module lib/throttle
 */

export const throttleConfig = { enabled: true, debug: false, timeout: 30000 };

export function configurethrottle(config: Partial<typeof throttleConfig>) {
  Object.assign(throttleConfig, config);
}

export function throttleInit(): boolean {
  console.log("[throttle] Initialized");
  return true;
}

export function throttleProcess(data: any): any {
  if (!throttleConfig.enabled) return data;
  if (throttleConfig.debug) console.log("[throttle] Processing:", data);
  return data;
}

export async function throttleAsync<T>(fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    if (throttleConfig.debug) console.log("[throttle] Completed in", Date.now() - start, "ms");
    return result;
  } catch (error) {
    console.error("[throttle] Error:", error);
    throw error;
  }
}

export function throttleValidate(value: unknown): boolean {
  return value !== null && value !== undefined;
}

export function throttleTransform<T, R>(data: T, transformer: (item: T) => R): R {
  return transformer(data);
}

export function throttleBatch<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}

export class throttleManager {
  private static instance: throttleManager;
  private data: Map<string, any> = new Map();

  static getInstance(): throttleManager {
    if (!throttleManager.instance) throttleManager.instance = new throttleManager();
    return throttleManager.instance;
  }

  set(key: string, value: any): void { this.data.set(key, value); }
  get(key: string): any { return this.data.get(key); }
  has(key: string): boolean { return this.data.has(key); }
  delete(key: string): boolean { return this.data.delete(key); }
  clear(): void { this.data.clear(); }
}

export default { configure: configurethrottle, init: throttleInit, process: throttleProcess, async: throttleAsync, validate: throttleValidate, transform: throttleTransform, batch: throttleBatch, Manager: throttleManager };
