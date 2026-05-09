import { supabase } from '@/integrations/supabase/client';
import CryptoJS from 'crypto-js';

const PONTO_OFFLINE_STORAGE_KEY = 'ponto_offline_queue';

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
}

export const pontoOfflineService = {
  // Gera hash de integridade Portaria 671
  generateIntegrityHash: (data: any) => {
    const payload = `${data.colaborador_id}|${data.timestamp}|${data.tipo}|${data.dispositivoId}`;
    return CryptoJS.SHA256(payload).toString();
  },

  queueRegistro: async (registro: Omit<OfflineRegistro, 'id' | 'hash'>) => {
    const queue: OfflineRegistro[] = JSON.parse(localStorage.getItem(PONTO_OFFLINE_STORAGE_KEY) || '[]');
    
    const id = crypto.randomUUID();
    const hash = pontoOfflineService.generateIntegrityHash(registro);
    
    const newEntry: OfflineRegistro = { ...registro, id, hash };
    queue.push(newEntry);
    
    localStorage.setItem(PONTO_OFFLINE_STORAGE_KEY, JSON.stringify(queue));
    return newEntry;
  },

  syncOfflineQueue: async () => {
    const queue: OfflineRegistro[] = JSON.parse(localStorage.getItem(PONTO_OFFLINE_STORAGE_KEY) || '[]');
    if (queue.length === 0) return { synced: 0, errors: 0 };

    let synced = 0;
    let errors = 0;
    const remaining: OfflineRegistro[] = [];

    for (const item of queue) {
      try {
        const { error } = await supabase.from('batidas_ponto').insert({
          colaborador_id: item.colaborador_id,
          tipo: item.tipo,
          data: item.timestamp.split('T')[0],
          hora: item.timestamp.split('T')[1].split('.')[0],
          latitude: item.latitude,
          longitude: item.longitude,
          precisao: item.precisao,
          dispositivo_id: item.dispositivoId,
          is_offline: true,
          sync_at: new Date().toISOString()
        });

        if (error) throw error;
        synced++;
      } catch (err) {
        console.error('Erro ao sincronizar registro offline:', err);
        errors++;
        remaining.push(item);
      }
    }

    localStorage.setItem(PONTO_OFFLINE_STORAGE_KEY, JSON.stringify(remaining));
    return { synced, errors };
  },

  getQueueSize: () => {
    const queue: OfflineRegistro[] = JSON.parse(localStorage.getItem(PONTO_OFFLINE_STORAGE_KEY) || '[]');
    return queue.length;
  }
};
