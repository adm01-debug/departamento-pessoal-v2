/**
 * debounce utilities
 * @module lib/debounce
 */

export const debounceConfig = { enabled: true, debug: false, timeout: 30000 };

export function configuredebounce(config: Partial<typeof debounceConfig>) {
  Object.assign(debounceConfig, config);
}

export function debounceInit(): boolean {
  console.log("[debounce] Initialized");
  return true;
}

export function debounceProcess(data: any): any {
  if (!debounceConfig.enabled) return data;
  if (debounceConfig.debug) console.log("[debounce] Processing:", data);
  return data;
}

export async function debounceAsync<T>(fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    if (debounceConfig.debug) console.log("[debounce] Completed in", Date.now() - start, "ms");
    return result;
  } catch (error) {
    console.error("[debounce] Error:", error);
    throw error;
  }
}

export function debounceValidate(value: unknown): boolean {
  return value !== null && value !== undefined;
}

export function debounceTransform<T, R>(data: T, transformer: (item: T) => R): R {
  return transformer(data);
}

export function debounceBatch<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}

export class debounceManager {
  private static instance: debounceManager;
  private data: Map<string, any> = new Map();

  static getInstance(): debounceManager {
    if (!debounceManager.instance) debounceManager.instance = new debounceManager();
    return debounceManager.instance;
  }

  set(key: string, value: any): void { this.data.set(key, value); }
  get(key: string): any { return this.data.get(key); }
  has(key: string): boolean { return this.data.has(key); }
  delete(key: string): boolean { return this.data.delete(key); }
  clear(): void { this.data.clear(); }
}

export default { configure: configuredebounce, init: debounceInit, process: debounceProcess, async: debounceAsync, validate: debounceValidate, transform: debounceTransform, batch: debounceBatch, Manager: debounceManager };
