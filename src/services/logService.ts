export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";
export interface LogEntry { level: LogLevel; message: string; timestamp: string; context?: string; data?: any; stack?: string; }
export interface LogConfig { minLevel: LogLevel; enableConsole: boolean; enableRemote: boolean; remoteUrl?: string; maxBufferSize: number; }

const levelPriority: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3, fatal: 4 };

class LogService {
  private config: LogConfig = { minLevel: "info", enableConsole: true, enableRemote: false, maxBufferSize: 100 };
  private buffer: LogEntry[] = [];

  configure(config: Partial<LogConfig>): void { this.config = { ...this.config, ...config }; }

  private shouldLog(level: LogLevel): boolean { return levelPriority[level] >= levelPriority[this.config.minLevel]; }

  private log(level: LogLevel, message: string, context?: string, data?: any): void {
    if (!this.shouldLog(level)) return;
    const entry: LogEntry = { level, message, timestamp: new Date().toISOString(), context, data };
    if (level === "error" || level === "fatal") entry.stack = new Error().stack;
    
    this.buffer.push(entry);
    if (this.buffer.length > this.config.maxBufferSize) this.buffer.shift();

    if (this.config.enableConsole) {
      const fn = level === "debug" ? console.debug : level === "info" ? console.info : level === "warn" ? console.warn : console.error;
      fn(`[${level.toUpperCase()}] ${context ? `[${context}] ` : ""}${message}`, data || "");
    }
  }

  debug(message: string, context?: string, data?: any): void { this.log("debug", message, context, data); }
  info(message: string, context?: string, data?: any): void { this.log("info", message, context, data); }
  warn(message: string, context?: string, data?: any): void { this.log("warn", message, context, data); }
  error(message: string, context?: string, data?: any): void { this.log("error", message, context, data); }
  fatal(message: string, context?: string, data?: any): void { this.log("fatal", message, context, data); }

  getBuffer(): LogEntry[] { return [...this.buffer]; }
  clearBuffer(): void { this.buffer = []; }
  getByLevel(level: LogLevel): LogEntry[] { return this.buffer.filter(e => e.level === level); }
  getByContext(context: string): LogEntry[] { return this.buffer.filter(e => e.context === context); }

  async flush(): Promise<void> {
    if (!this.config.enableRemote || !this.config.remoteUrl) return;
    try { await fetch(this.config.remoteUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(this.buffer) }); this.clearBuffer(); }
    catch (e) { console.error("[Log] Flush failed:", e); }
  }

  createContext(name: string): { debug: (m: string, d?: any) => void; info: (m: string, d?: any) => void; warn: (m: string, d?: any) => void; error: (m: string, d?: any) => void } {
    return { debug: (m, d) => this.debug(m, name, d), info: (m, d) => this.info(m, name, d), warn: (m, d) => this.warn(m, name, d), error: (m, d) => this.error(m, name, d) };
  }
}

export const logService = new LogService();
export default logService;
