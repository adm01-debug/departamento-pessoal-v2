import { supabase } from "@/integrations/supabase/client";

export interface HealthStatus { status: "healthy" | "degraded" | "unhealthy"; timestamp: string; uptime: number; version: string; checks: HealthCheck[]; }
export interface HealthCheck { name: string; status: "pass" | "fail" | "warn"; duration: number; message?: string; }

class HealthService {
  private startTime = Date.now();

  async check(): Promise<HealthStatus> {
    const checks = await Promise.all([this.checkDatabase(), this.checkMemory(), this.checkStorage()]);
    const hasFailure = checks.some(c => c.status === "fail");
    const hasWarn = checks.some(c => c.status === "warn");
    return { status: hasFailure ? "unhealthy" : hasWarn ? "degraded" : "healthy", timestamp: new Date().toISOString(), uptime: Date.now() - this.startTime, version: "1.0.0", checks };
  }

  private async checkDatabase(): Promise<HealthCheck> {
    const start = Date.now();
    try { await supabase.from("colaboradores").select("id").limit(1); return { name: "database", status: "pass", duration: Date.now() - start }; }
    catch (e) { return { name: "database", status: "fail", duration: Date.now() - start, message: String(e) }; }
  }

  private async checkMemory(): Promise<HealthCheck> {
    const used = (performance as any).memory?.usedJSHeapSize || 0;
    const limit = (performance as any).memory?.jsHeapSizeLimit || 1;
    const percent = (used / limit) * 100;
    return { name: "memory", status: percent > 90 ? "fail" : percent > 70 ? "warn" : "pass", duration: 0, message: `${percent.toFixed(1)}% used` };
  }

  private async checkStorage(): Promise<HealthCheck> {
    try { if (navigator.storage) { const { quota = 0, usage = 0 } = await navigator.storage.estimate(); const percent = (usage / quota) * 100; return { name: "storage", status: percent > 90 ? "warn" : "pass", duration: 0, message: `${percent.toFixed(1)}% used` }; } return { name: "storage", status: "pass", duration: 0 }; }
    catch { return { name: "storage", status: "pass", duration: 0 }; }
  }

  async ping(): Promise<{ pong: boolean; latency: number }> {
    const start = Date.now();
    await this.checkDatabase();
    return { pong: true, latency: Date.now() - start };
  }

  getUptime(): number { return Date.now() - this.startTime; }
  getUptimeFormatted(): string { const s = Math.floor(this.getUptime() / 1000); const d = Math.floor(s / 86400); const h = Math.floor((s % 86400) / 3600); const m = Math.floor((s % 3600) / 60); return `${d}d ${h}h ${m}m`; }
}

export const healthService = new HealthService();
export default healthService;
