/**
 * worker utilities
 * @module lib/worker
 */

export const workerConfig = { enabled: true, debug: false, timeout: 30000 };

export function configureworker(config: Partial<typeof workerConfig>) {
  Object.assign(workerConfig, config);
}

export function workerInit(): boolean {
  console.log("[worker] Initialized");
  return true;
}

export function workerProcess(data: any): any {
  if (!workerConfig.enabled) return data;
  if (workerConfig.debug) console.log("[worker] Processing:", data);
  return data;
}

export async function workerAsync<T>(fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    if (workerConfig.debug) console.log("[worker] Completed in", Date.now() - start, "ms");
    return result;
  } catch (error) {
    console.error("[worker] Error:", error);
    throw error;
  }
}

export function workerValidate(value: unknown): boolean {
  return value !== null && value !== undefined;
}

export function workerTransform<T, R>(data: T, transformer: (item: T) => R): R {
  return transformer(data);
}

export function workerBatch<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}

export class workerManager {
  private static instance: workerManager;
  private data: Map<string, any> = new Map();

  static getInstance(): workerManager {
    if (!workerManager.instance) workerManager.instance = new workerManager();
    return workerManager.instance;
  }

  set(key: string, value: any): void { this.data.set(key, value); }
  get(key: string): any { return this.data.get(key); }
  has(key: string): boolean { return this.data.has(key); }
  delete(key: string): boolean { return this.data.delete(key); }
  clear(): void { this.data.clear(); }
}

export default { configure: configureworker, init: workerInit, process: workerProcess, async: workerAsync, validate: workerValidate, transform: workerTransform, batch: workerBatch, Manager: workerManager };
