import { supabase } from "@/integrations/supabase/client";

export interface AuditLog {
  id?: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "READ" | "LOGIN" | "LOGOUT" | "EXPORT" | "IMPORT";
  entity: string;
  entityId?: string;
  userId: string;
  userName?: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  metadata?: Record<string, any>;
  status: "SUCCESS" | "FAILURE" | "PENDING";
  errorMessage?: string;
}

export interface AuditFilter {
  action?: string;
  entity?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  page?: number;
  limit?: number;
}

class AuditService {
  private logs: AuditLog[] = [];

  async log(entry: Omit<AuditLog, "id" | "timestamp">): Promise<AuditLog> {
    const log: AuditLog = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    this.logs.push(log);
    console.log(`[AUDIT] ${log.action} ${log.entity} by ${log.userId}`);
    return log;
  }

  async logCreate(entity: string, entityId: string, userId: string, newValues: Record<string, any>): Promise<AuditLog> {
    return this.log({ action: "CREATE", entity, entityId, userId, newValues, status: "SUCCESS" });
  }

  async logUpdate(entity: string, entityId: string, userId: string, oldValues: Record<string, any>, newValues: Record<string, any>): Promise<AuditLog> {
    return this.log({ action: "UPDATE", entity, entityId, userId, oldValues, newValues, status: "SUCCESS" });
  }

  async logDelete(entity: string, entityId: string, userId: string, oldValues: Record<string, any>): Promise<AuditLog> {
    return this.log({ action: "DELETE", entity, entityId, userId, oldValues, status: "SUCCESS" });
  }

  async logRead(entity: string, entityId: string, userId: string): Promise<AuditLog> {
    return this.log({ action: "READ", entity, entityId, userId, status: "SUCCESS" });
  }

  async logLogin(userId: string, userName: string, ipAddress?: string): Promise<AuditLog> {
    return this.log({ action: "LOGIN", entity: "auth", userId, userName, ipAddress, status: "SUCCESS" });
  }

  async logLogout(userId: string): Promise<AuditLog> {
    return this.log({ action: "LOGOUT", entity: "auth", userId, status: "SUCCESS" });
  }

  async logExport(entity: string, userId: string, metadata?: Record<string, any>): Promise<AuditLog> {
    return this.log({ action: "EXPORT", entity, userId, metadata, status: "SUCCESS" });
  }

  async logImport(entity: string, userId: string, metadata?: Record<string, any>): Promise<AuditLog> {
    return this.log({ action: "IMPORT", entity, userId, metadata, status: "SUCCESS" });
  }

  async getLogs(filter: AuditFilter): Promise<{ data: AuditLog[]; total: number }> {
    let filtered = [...this.logs];
    if (filter.action) filtered = filtered.filter(l => l.action === filter.action);
    if (filter.entity) filtered = filtered.filter(l => l.entity === filter.entity);
    if (filter.userId) filtered = filtered.filter(l => l.userId === filter.userId);
    if (filter.status) filtered = filtered.filter(l => l.status === filter.status);
    if (filter.startDate) filtered = filtered.filter(l => l.timestamp >= filter.startDate!);
    if (filter.endDate) filtered = filtered.filter(l => l.timestamp <= filter.endDate!);
    
    const page = filter.page || 1;
    const limit = filter.limit || 50;
    const start = (page - 1) * limit;
    
    return {
      data: filtered.slice(start, start + limit),
      total: filtered.length,
    };
  }

  async getLogById(id: string): Promise<AuditLog | null> {
    return this.logs.find(l => l.id === id) || null;
  }

  async getLogsByEntity(entity: string, entityId: string): Promise<AuditLog[]> {
    return this.logs.filter(l => l.entity === entity && l.entityId === entityId);
  }

  async getLogsByUser(userId: string, limit: number = 100): Promise<AuditLog[]> {
    return this.logs.filter(l => l.userId === userId).slice(0, limit);
  }

  async getRecentLogs(limit: number = 50): Promise<AuditLog[]> {
    return this.logs.slice(-limit).reverse();
  }

  async getStats(): Promise<{
    totalLogs: number;
    byAction: Record<string, number>;
    byEntity: Record<string, number>;
    byStatus: Record<string, number>;
  }> {
    const byAction: Record<string, number> = {};
    const byEntity: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    this.logs.forEach(log => {
      byAction[log.action] = (byAction[log.action] || 0) + 1;
      byEntity[log.entity] = (byEntity[log.entity] || 0) + 1;
      byStatus[log.status] = (byStatus[log.status] || 0) + 1;
    });

    return { totalLogs: this.logs.length, byAction, byEntity, byStatus };
  }
}

export const auditService = new AuditService();
export default auditService;
