// @ts-nocheck
// V16-FIX: Offline Sync Service - Resolução de Conflitos
import { supabase } from '@/integrations/supabase/client';

export interface PendingOperation {
  id: string;
  table: string;
  operation: 'create' | 'update' | 'delete';
  data: Record<string, unknown>;
  timestamp: number;
  retries: number;
}

const STORAGE_KEY = 'dp_pending_operations';
const MAX_RETRIES = 3;

export const offlineSyncService = {
  // Salvar operação pendente
  savePendingOperation(op: Omit<PendingOperation, 'id' | 'timestamp' | 'retries'>): void {
    const pending = this.getPendingOperations();
    pending.push({
      ...op,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      retries: 0,
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
  },

  // Obter operações pendentes
  getPendingOperations(): PendingOperation[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // Limpar operação específica
  removePendingOperation(id: string): void {
    const pending = this.getPendingOperations().filter(op => op.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
  },

  // Sincronizar todas as operações pendentes
  async syncAll(): Promise<{ success: number; failed: number; conflicts: number }> {
    const pending = this.getPendingOperations();
    let success = 0;
    let failed = 0;
    let conflicts = 0;

    for (const op of pending) {
      try {
        const result = await this.syncOperation(op);
        if (result.success) {
          this.removePendingOperation(op.id);
          success++;
        } else if (result.conflict) {
          conflicts++;
          // Manter operação para resolução manual
        } else {
          failed++;
          if (op.retries >= MAX_RETRIES) {
            this.removePendingOperation(op.id);
          } else {
            this.incrementRetry(op.id);
          }
        }
      } catch (error) {
        failed++;
        console.error('Sync error:', error);
      }
    }

    return { success, failed, conflicts };
  },

  // Sincronizar operação individual
  async syncOperation(op: PendingOperation): Promise<{ success: boolean; conflict?: boolean }> {
    // Verificar se há conflito (dados foram alterados no servidor)
    if (op.operation === 'update' && op.data.id) {
      const { data: current } = await supabase
        .from(op.table)
        .select('updated_at')
        .eq('id', op.data.id)
        .single();

      if (current && current.updated_at) {
        const serverTime = new Date(current.updated_at).getTime();
        if (serverTime > op.timestamp) {
          // Conflito detectado - servidor tem dados mais recentes
          return { success: false, conflict: true };
        }
      }
    }

    // Executar operação
    let result;
    switch (op.operation) {
      case 'create':
        result = await supabase.from(op.table).insert(op.data);
        break;
      case 'update':
        result = await supabase.from(op.table).update(op.data).eq('id', op.data.id);
        break;
      case 'delete':
        result = await supabase.from(op.table).delete().eq('id', op.data.id);
        break;
    }

    return { success: !result.error };
  },

  incrementRetry(id: string): void {
    const pending = this.getPendingOperations();
    const op = pending.find(p => p.id === id);
    if (op) {
      op.retries++;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
    }
  },

  // Resolver conflito manualmente
  async resolveConflict(opId: string, strategy: 'keep_local' | 'keep_server' | 'merge'): Promise<boolean> {
    const pending = this.getPendingOperations();
    const op = pending.find(p => p.id === opId);
    
    if (!op) return false;

    if (strategy === 'keep_server') {
      // Descartar alteração local
      this.removePendingOperation(opId);
      return true;
    }

    if (strategy === 'keep_local') {
      // Forçar alteração local (sobrescrever servidor)
      const { error } = await supabase
        .from(op.table)
        .update({ ...op.data, updated_at: new Date().toISOString() })
        .eq('id', op.data.id);
      
      if (!error) {
        this.removePendingOperation(opId);
        return true;
      }
    }

    // Merge requer lógica específica por tabela
    // Implementar conforme necessidade

    return false;
  },

  // Verificar se há operações pendentes
  hasPendingOperations(): boolean {
    return this.getPendingOperations().length > 0;
  },

  // Contar operações pendentes
  getPendingCount(): number {
    return this.getPendingOperations().length;
  },
};

export default offlineSyncService;
