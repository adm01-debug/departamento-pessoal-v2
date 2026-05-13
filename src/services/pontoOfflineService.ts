import { supabase } from '@/integrations/supabase/client';
import CryptoJS from 'crypto-js';

const PONTO_OFFLINE_STORAGE_KEY = 'ponto_offline_queue';
const CRYPTO_KEY = 'lovable-ponto-secure-v1';

export interface OfflineRegistro {
  id: string;
  tipo: 'entrada' | 'saida_almoco' | 'retorno_almoco' | 'saida';
  colaborador_id: string;
  timestamp: string;
  latitude?: number;
  longitude?: number;
  precisao?: number;
  dispositivoId: string;
  hash?: string;
  foto_base64?: string | null;
}

export const pontoOfflineService = {
  generateIntegrityHash: (data: any) => {
    const payload = `${data.colaborador_id}|${data.timestamp}|${data.tipo}|${data.dispositivoId}`;
    return CryptoJS.SHA256(payload).toString();
  },

  queueRegistro: async (registro: Omit<OfflineRegistro, 'id'>) => {
    const stored = localStorage.getItem(PONTO_OFFLINE_STORAGE_KEY);
    let queue: OfflineRegistro[] = [];
    
    if (stored) {
      try {
        const bytes = CryptoJS.AES.decrypt(stored, CRYPTO_KEY);
        queue = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      } catch (e) {
        queue = [];
      }
    }
    
    const id = crypto.randomUUID();
    const hash = registro.hash || pontoOfflineService.generateIntegrityHash(registro);
    
    const newEntry: OfflineRegistro = { ...registro, id, hash };
    queue.push(newEntry);
    
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(queue), CRYPTO_KEY).toString();
    localStorage.setItem(PONTO_OFFLINE_STORAGE_KEY, encrypted);
    return newEntry;
  },

  syncOfflineQueue: async () => {
    const stored = localStorage.getItem(PONTO_OFFLINE_STORAGE_KEY);
    if (!stored) return { synced: 0, errors: 0 };

    let queue: OfflineRegistro[] = [];
    try {
      const bytes = CryptoJS.AES.decrypt(stored, CRYPTO_KEY);
      queue = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (e) {
      localStorage.removeItem(PONTO_OFFLINE_STORAGE_KEY);
      return { synced: 0, errors: 1 };
    }
    
    if (queue.length === 0) return { synced: 0, errors: 0 };

    let synced = 0;
    let errors = 0;
    const remaining: OfflineRegistro[] = [];

    // 1. Enviar lote para a Edge Function de processamento
    try {
      const { data, error } = await supabase.functions.invoke('processar-ponto-offline', {
        body: { registros: queue }
      });

      if (error) throw error;
      
      if (data.success) {
        synced = data.success_count || data.success;
        errors = data.error_count || data.errors;
        
        // Se houver erros específicos de registros, mantemos apenas os que falharam na fila
        if (data.details && data.details.length > 0) {
          const failedIds = data.details.map((d: any) => d.id);
          queue.forEach(item => {
            if (failedIds.includes(item.id)) remaining.push(item);
          });
        }
      }
    } catch (err) {
      console.error('[OfflineSync] Falha na comunicação com o servidor:', err);
      return { synced: 0, errors: queue.length };
    }
    if (remaining.length === 0 && (synced > 0 || errors > 0)) {
      localStorage.removeItem(PONTO_OFFLINE_STORAGE_KEY);
    } else if (remaining.length > 0) {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(remaining), CRYPTO_KEY).toString();
      localStorage.setItem(PONTO_OFFLINE_STORAGE_KEY, encrypted);
    }
    return { synced, errors };
  },

  getQueueSize: () => {
    const stored = localStorage.getItem(PONTO_OFFLINE_STORAGE_KEY);
    if (!stored) return 0;
    try {
      const bytes = CryptoJS.AES.decrypt(stored, CRYPTO_KEY);
      const queue = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return queue.length;
    } catch (e) {
      return 0;
    }
  }
};
