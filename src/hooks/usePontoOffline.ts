import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { pontoService } from '@/services';

interface BatidaOffline {
  id: string;
  tipo: string;
  colaboradorId: string;
  timestamp: string;
  geo: any;
}

export function usePontoOffline() {
  const [offlineBatidas, setOfflineBatidas] = useState<BatidaOffline[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('ponto_offline_queue');
    if (saved) {
      setOfflineBatidas(JSON.parse(saved));
    }
  }, []);

  const addOffline = (tipo: string, colaboradorId: string, geo: any) => {
    const nova: BatidaOffline = {
      id: crypto.randomUUID(),
      tipo,
      colaboradorId,
      timestamp: new Date().toISOString(),
      geo
    };
    const updated = [...offlineBatidas, nova];
    setOfflineBatidas(updated);
    localStorage.setItem('ponto_offline_queue', JSON.stringify(updated));
    toast.warning('Você está offline. O ponto foi salvo localmente e será sincronizado quando houver conexão.');
  };

  const sync = async () => {
    if (offlineBatidas.length === 0 || !navigator.onLine) return;

    let successCount = 0;
    const remaining: BatidaOffline[] = [];

    for (const batida of offlineBatidas) {
      try {
        await pontoService.registrar(batida.tipo as any, batida.colaboradorId, {
          latitude: batida.geo?.lat,
          longitude: batida.geo?.lng,
          precisao: batida.geo?.accuracy,
          dispositivoId: navigator.userAgent + ' (OFFLINE_SYNC)',
          metadata: { offline_original_timestamp: batida.timestamp }
        });
        successCount++;
      } catch (err) {
        console.error('Erro ao sincronizar batida:', err);
        remaining.push(batida);
      }
    }

    setOfflineBatidas(remaining);
    localStorage.setItem('ponto_offline_queue', JSON.stringify(remaining));

    if (successCount > 0) {
      toast.success(`${successCount} batida(s) sincronizada(s) com sucesso!`);
    }
  };

  useEffect(() => {
    window.addEventListener('online', sync);
    return () => window.removeEventListener('online', sync);
  }, [offlineBatidas]);

  return { offlineBatidas, addOffline, sync };
}
