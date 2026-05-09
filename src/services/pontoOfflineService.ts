import { supabase } from '@/integrations/supabase/client';
import CryptoJS from 'crypto-js';
import { toast } from 'sonner';

const PONTO_OFFLINE_STORAGE_KEY = 'ponto_offline_queue';
const CRYPTO_KEY = 'lovable-ponto-secure-v1'; // Em produção, viria de config segura

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
    // Recupera e descriptografa fila existente
    const stored = localStorage.getItem(PONTO_OFFLINE_STORAGE_KEY);
    let queue: OfflineRegistro[] = [];
    
    if (stored) {
      try {
        const bytes = CryptoJS.AES.decrypt(stored, CRYPTO_KEY);
        queue = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      } catch (e) {
        console.error('Falha ao descriptografar fila offline. Resetando.', e);
        queue = [];
      }
    }
    
    const hash = registro.hash || pontoOfflineService.generateIntegrityHash(registro);
    
    const newEntry: OfflineRegistro = { ...registro, id, hash };
    queue.push(newEntry);
    
    // Criptografa antes de salvar
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
      return { synced: 0, errors: 1 };
    }
    
    if (queue.length === 0) return { synced: 0, errors: 0 };

    let synced = 0;
    let errors = 0;
    const remaining: OfflineRegistro[] = [];

    for (const item of queue) {
      try {
        // Usamos uma asserção de tipo para evitar erros com o gerador de tipos do Supabase
        const { error } = await (supabase as any).from('batidas_ponto').insert({
          colaborador_id: item.colaborador_id,
          tipo: item.tipo,
          data: item.timestamp.split('T')[0],
          hora: item.timestamp.split('T')[1].split('.')[0],
          latitude: item.latitude,
          longitude: item.longitude,
          precisao: item.precisao,
          dispositivo_id: item.dispositivoId,
          is_offline: true,
          sync_at: new Date().toISOString(),
          hash_integridade: item.hash
        });

        if (error) throw error;
        synced++;
      } catch (err) {
        console.error('Erro ao sincronizar registro offline:', err);
        errors++;
        remaining.push(item);
      }
    }

    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(remaining), CRYPTO_KEY).toString();
    localStorage.setItem(PONTO_OFFLINE_STORAGE_KEY, encrypted);
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
