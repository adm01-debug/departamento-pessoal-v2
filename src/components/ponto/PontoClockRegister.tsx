import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, LogIn, Coffee, LogOut, MapPin, WifiOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { pontoOfflineService } from '@/services/pontoOfflineService';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts';

interface PontoClockRegisterProps {
  time: Date;
  loading: string | null;
  geoStatus: 'idle' | 'capturing' | 'success' | 'error';
  onRegistrar: (tipo: 'entrada' | 'saida_almoco' | 'retorno_almoco' | 'saida') => void;
}

const buttons = [
  { tipo: 'entrada' as const, label: 'Entrada', icon: LogIn, gradient: 'from-primary to-primary-glow' },
  { tipo: 'saida_almoco' as const, label: 'Saída Almoço', icon: Coffee, gradient: 'from-primary-glow to-primary' },
  { tipo: 'retorno_almoco' as const, label: 'Retorno Almoço', icon: Coffee, gradient: 'from-primary to-primary-glow' },
  { tipo: 'saida' as const, label: 'Saída', icon: LogOut, gradient: 'from-destructive to-destructive/70/70' },
];

export function PontoClockRegister({ time, loading, geoStatus, onRegistrar }: PontoClockRegisterProps) {
  const { user } = useAuth();
  const [offlineQueueSize, setOfflineQueueSize] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setOfflineQueueSize(pontoOfflineService.getQueueSize());
    
    // Tenta sincronizar se estiver online
    if (navigator.onLine) {
      handleSync();
    }

    const interval = setInterval(() => {
      setOfflineQueueSize(pontoOfflineService.getQueueSize());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSync = async () => {
    if (isSyncing || !navigator.onLine) return;
    setIsSyncing(true);
    try {
      const result = await pontoOfflineService.syncOfflineQueue();
      if (result.synced > 0) {
        toast.success(`${result.synced} registros offline sincronizados!`);
      }
    } catch (e) {
      console.error('Erro na sincronização automática', e);
    } finally {
      setIsSyncing(false);
      setOfflineQueueSize(pontoOfflineService.getQueueSize());
    }
  };

  const handleOfflineRegister = async (tipo: 'entrada' | 'saida_almoco' | 'retorno_almoco' | 'saida') => {
    if (!user) return;
    
    // Se estiver online, usa o fluxo padrão
    if (navigator.onLine) {
      onRegistrar(tipo);
      return;
    }

    // Modo Offline
    try {
      const { data: colab } = await (window as any).supabase.from('colaboradores').select('id').eq('email', user.email).maybeSingle();
      if (!colab) throw new Error('Colaborador não identificado localmente');

      await pontoOfflineService.queueRegistro({
        tipo,
        colaborador_id: colab.id,
        timestamp: new Date().toISOString(),
        dispositivoId: navigator.userAgent
      });
      
      toast.warning(`Ponto registrado em modo OFFLINE. Será sincronizado quando a conexão voltar.`, {
        icon: <WifiOff className="h-4 w-4" />
      });
      setOfflineQueueSize(pontoOfflineService.getQueueSize());
    } catch (e: any) {
      toast.error(`Erro no registro offline: ${e.message}`);
    }
  };
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
        <div className="h-[2px] bg-gradient-to-r from-primary/60 to-primary/90" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5 font-display">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/60 to-primary/90">
              <Clock className="h-4 w-4 text-primary-foreground" />
            </div>
            Registrar Ponto
            {offlineQueueSize > 0 && (
              <Badge variant="outline" className="ml-auto text-[10px] bg-warning/10 text-warning border-warning/20 animate-pulse">
                <WifiOff className="h-3 w-3 mr-1" /> {offlineQueueSize} pendentes
              </Badge>
            )}
            {offlineQueueSize > 0 && navigator.onLine && (
              <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" onClick={handleSync} disabled={isSyncing}>
                <RefreshCw className={cn("h-3 w-3", isSyncing && "animate-spin")} />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-display font-bold text-center mb-8 tabular-nums bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {time.toLocaleTimeString('pt-BR')}
          </div>
          <p className="text-center text-sm text-muted-foreground font-body mb-4">
            {time.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {buttons.map(({ tipo, label, icon: Icon, gradient }) => (
              <Button
                key={tipo}
                onClick={() => handleOfflineRegister(tipo)}
                disabled={loading !== null}
                className={cn(
                  'h-12 rounded-xl bg-gradient-to-r text-primary-foreground hover:opacity-90 shadow-lg transition-all font-body font-medium',
                  gradient
                )}
              >
                {loading === tipo && geoStatus === 'capturing' ? (
                  <><MapPin className="h-4 w-4 mr-2 animate-bounce" />Capturando GPS...</>
                ) : (
                  <><Icon className="h-4 w-4 mr-2" />{loading === tipo ? 'Registrando...' : label}</>
                )}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground font-body text-center mt-3 flex items-center justify-center gap-1">
            <MapPin className="h-3 w-3" />
            {geoStatus === 'capturing' ? 'Capturando localização...' :
             geoStatus === 'success' ? '✅ Localização capturada' :
             geoStatus === 'error' ? '⚠️ GPS indisponível' :
             'Localização será registrada automaticamente'}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
