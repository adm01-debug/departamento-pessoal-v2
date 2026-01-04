/**
 * event utilities
 * @module lib/event
 */

export const eventConfig = { enabled: true, debug: false, timeout: 30000 };

export function configureevent(config: Partial<typeof eventConfig>) {
  Object.assign(eventConfig, config);
}

export function eventInit(): boolean {
  console.log("[event] Initialized");
  return true;
}

export function eventProcess(data: any): any {
  if (!eventConfig.enabled) return data;
  if (eventConfig.debug) console.log("[event] Processing:", data);
  return data;
}

export async function eventAsync<T>(fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    if (eventConfig.debug) console.log("[event] Completed in", Date.now() - start, "ms");
    return result;
  } catch (error) {
    console.error("[event] Error:", error);
    throw error;
  }
}

export function eventValidate(value: unknown): boolean {
  return value !== null && value !== undefined;
}

export function eventTransform<T, R>(data: T, transformer: (item: T) => R): R {
  return transformer(data);
}

export function eventBatch<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}

export class eventManager {
  private static instance: eventManager;
  private data: Map<string, any> = new Map();

  static getInstance(): eventManager {
    if (!eventManager.instance) eventManager.instance = new eventManager();
    return eventManager.instance;
  }

  set(key: string, value: any): void { this.data.set(key, value); }
  get(key: string): any { return this.data.get(key); }
  has(key: string): boolean { return this.data.has(key); }
  delete(key: string): boolean { return this.data.delete(key); }
  clear(): void { this.data.clear(); }
}

export default { configure: configureevent, init: eventInit, process: eventProcess, async: eventAsync, validate: eventValidate, transform: eventTransform, batch: eventBatch, Manager: eventManager };
