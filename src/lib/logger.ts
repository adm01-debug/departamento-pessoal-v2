/**
 * Logger utilities
 * @module lib/logger
 */

export interface Logger {
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
  debug: (message: string, ...args: any[]) => void;
}

export const loggerConfig = { enabled: true, debug: false, timeout: 30000 };

export function configurelogger(config: Partial<typeof loggerConfig>) {
  Object.assign(loggerConfig, config);
}

export function loggerInit(): boolean {
  console.log("[logger] Initialized");
  return true;
}

export function loggerProcess(data: any): any {
  if (!loggerConfig.enabled) return data;
  if (loggerConfig.debug) console.log("[logger] Processing:", data);
  return data;
}

export async function loggerAsync<T>(fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    if (loggerConfig.debug) console.log("[logger] Completed in", Date.now() - start, "ms");
    return result;
  } catch (error) {
    console.error("[logger] Error:", error);
    throw error;
  }
}

export function loggerValidate(value: unknown): boolean {
  return value !== null && value !== undefined;
}

export function loggerTransform<T, R>(data: T, transformer: (item: T) => R): R {
  return transformer(data);
}

export function loggerBatch<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}

export class loggerManager {
  private static instance: loggerManager;
  private data: Map<string, any> = new Map();

  static getInstance(): loggerManager {
    if (!loggerManager.instance) loggerManager.instance = new loggerManager();
    return loggerManager.instance;
  }

  set(key: string, value: any): void { this.data.set(key, value); }
  get(key: string): any { return this.data.get(key); }
  has(key: string): boolean { return this.data.has(key); }
  delete(key: string): boolean { return this.data.delete(key); }
  clear(): void { this.data.clear(); }
}

// Named export for components that import { logger }
export const logger: Logger = {
  info: (message: string, ...args: any[]) => {
    if (loggerConfig.enabled) console.log(`[INFO] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    if (loggerConfig.enabled) console.warn(`[WARN] ${message}`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  debug: (message: string, ...args: any[]) => {
    if (loggerConfig.debug) console.log(`[DEBUG] ${message}`, ...args);
  },
};

export default { 
  configure: configurelogger, 
  init: loggerInit, 
  process: loggerProcess, 
  async: loggerAsync, 
  validate: loggerValidate, 
  transform: loggerTransform, 
  batch: loggerBatch, 
  Manager: loggerManager,
  ...logger
};
