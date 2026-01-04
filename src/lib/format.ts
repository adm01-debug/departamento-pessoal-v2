/**
 * format utilities
 * @module lib/format
 */

export const formatConfig = { enabled: true, debug: false, timeout: 30000 };

export function configureformat(config: Partial<typeof formatConfig>) {
  Object.assign(formatConfig, config);
}

export function formatInit(): boolean {
  console.log("[format] Initialized");
  return true;
}

export function formatProcess(data: any): any {
  if (!formatConfig.enabled) return data;
  if (formatConfig.debug) console.log("[format] Processing:", data);
  return data;
}

export async function formatAsync<T>(fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    if (formatConfig.debug) console.log("[format] Completed in", Date.now() - start, "ms");
    return result;
  } catch (error) {
    console.error("[format] Error:", error);
    throw error;
  }
}

export function formatValidate(value: unknown): boolean {
  return value !== null && value !== undefined;
}

export function formatTransform<T, R>(data: T, transformer: (item: T) => R): R {
  return transformer(data);
}

export function formatBatch<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}

export class formatManager {
  private static instance: formatManager;
  private data: Map<string, any> = new Map();

  static getInstance(): formatManager {
    if (!formatManager.instance) formatManager.instance = new formatManager();
    return formatManager.instance;
  }

  set(key: string, value: any): void { this.data.set(key, value); }
  get(key: string): any { return this.data.get(key); }
  has(key: string): boolean { return this.data.has(key); }
  delete(key: string): boolean { return this.data.delete(key); }
  clear(): void { this.data.clear(); }
}

export default { configure: configureformat, init: formatInit, process: formatProcess, async: formatAsync, validate: formatValidate, transform: formatTransform, batch: formatBatch, Manager: formatManager };
