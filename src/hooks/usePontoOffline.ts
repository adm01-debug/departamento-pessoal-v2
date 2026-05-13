import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { pontoOfflineService } from '@/services/pontoOfflineService';

export function usePontoOffline() {
  const [queueSize, setQueueSize] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const updateSize = () => {
    setQueueSize(pontoOfflineService.getQueueSize());
  };

  useEffect(() => {
    updateSize();
    // Listener para mudanças no localStorage (útil entre abas)
    window.addEventListener('storage', updateSize);
    return () => window.removeEventListener('storage', updateSize);
  }, []);

  const addOffline = async (tipo: any, colaboradorId: string, geo: any) => {
    try {
      await pontoOfflineService.queueRegistro({
        tipo,
        colaborador_id: colaboradorId,
        timestamp: new Date().toISOString(),
        latitude: geo?.lat || geo?.latitude,
        longitude: geo?.lng || geo?.longitude,
        precisao: geo?.accuracy,
        dispositivoId: navigator.userAgent
      });
      updateSize();
      toast.warning('Você está offline. O ponto foi salvo localmente com criptografia e será sincronizado automaticamente quando houver conexão.');
    } catch (error) {
      console.error('Erro ao enfileirar ponto offline:', error);
      toast.error('Falha ao salvar ponto offline.');
    }
  };

  const sync = async () => {
    if (isSyncing || !navigator.onLine) return;
    
    setIsSyncing(true);
    try {
      const result = await pontoOfflineService.syncOfflineQueue();
      updateSize();
      
      if (result.synced > 0) {
        toast.success(`${result.synced} batida(s) offline sincronizada(s) com sucesso!`);
      }
      if (result.errors > 0) {
        toast.error(`${result.errors} batida(s) não puderam ser sincronizadas e permanecem na fila.`);
      }
    } catch (error) {
      console.error('Erro durante sincronização de ponto:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    window.addEventListener('online', sync);
    // Tenta sincronizar se já estiver online ao montar
    if (navigator.onLine) {
      sync();
    }
    return () => window.removeEventListener('online', sync);
  }, []);

  return { 
    offlineBatidasCount: queueSize, 
    addOffline, 
    sync,
    isSyncing 
  };
}
