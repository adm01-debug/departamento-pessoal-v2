/**
 * websocket utilities
 * @module lib/websocket
 */

export const websocketConfig = { enabled: true, debug: false, timeout: 30000 };

export function configurewebsocket(config: Partial<typeof websocketConfig>) {
  Object.assign(websocketConfig, config);
}

export function websocketInit(): boolean {
  console.log("[websocket] Initialized");
  return true;
}

export function websocketProcess(data: any): any {
  if (!websocketConfig.enabled) return data;
  if (websocketConfig.debug) console.log("[websocket] Processing:", data);
  return data;
}

export async function websocketAsync<T>(fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    if (websocketConfig.debug) console.log("[websocket] Completed in", Date.now() - start, "ms");
    return result;
  } catch (error) {
    console.error("[websocket] Error:", error);
    throw error;
  }
}

export function websocketValidate(value: unknown): boolean {
  return value !== null && value !== undefined;
}

export function websocketTransform<T, R>(data: T, transformer: (item: T) => R): R {
  return transformer(data);
}

export function websocketBatch<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}

export class websocketManager {
  private static instance: websocketManager;
  private data: Map<string, any> = new Map();

  static getInstance(): websocketManager {
    if (!websocketManager.instance) websocketManager.instance = new websocketManager();
    return websocketManager.instance;
  }

  set(key: string, value: any): void { this.data.set(key, value); }
  get(key: string): any { return this.data.get(key); }
  has(key: string): boolean { return this.data.has(key); }
  delete(key: string): boolean { return this.data.delete(key); }
  clear(): void { this.data.clear(); }
}

export default { configure: configurewebsocket, init: websocketInit, process: websocketProcess, async: websocketAsync, validate: websocketValidate, transform: websocketTransform, batch: websocketBatch, Manager: websocketManager };
