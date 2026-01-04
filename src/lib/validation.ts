/**
 * validation utilities
 * @module lib/validation
 */

export const validationConfig = { enabled: true, debug: false, timeout: 30000 };

export function configurevalidation(config: Partial<typeof validationConfig>) {
  Object.assign(validationConfig, config);
}

export function validationInit(): boolean {
  console.log("[validation] Initialized");
  return true;
}

export function validationProcess(data: any): any {
  if (!validationConfig.enabled) return data;
  if (validationConfig.debug) console.log("[validation] Processing:", data);
  return data;
}

export async function validationAsync<T>(fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    if (validationConfig.debug) console.log("[validation] Completed in", Date.now() - start, "ms");
    return result;
  } catch (error) {
    console.error("[validation] Error:", error);
    throw error;
  }
}

export function validationValidate(value: unknown): boolean {
  return value !== null && value !== undefined;
}

export function validationTransform<T, R>(data: T, transformer: (item: T) => R): R {
  return transformer(data);
}

export function validationBatch<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}

export class validationManager {
  private static instance: validationManager;
  private data: Map<string, any> = new Map();

  static getInstance(): validationManager {
    if (!validationManager.instance) validationManager.instance = new validationManager();
    return validationManager.instance;
  }

  set(key: string, value: any): void { this.data.set(key, value); }
  get(key: string): any { return this.data.get(key); }
  has(key: string): boolean { return this.data.has(key); }
  delete(key: string): boolean { return this.data.delete(key); }
  clear(): void { this.data.clear(); }
}

export default { configure: configurevalidation, init: validationInit, process: validationProcess, async: validationAsync, validate: validationValidate, transform: validationTransform, batch: validationBatch, Manager: validationManager };
