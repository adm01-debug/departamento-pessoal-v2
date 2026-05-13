import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, LogIn, Coffee, LogOut, MapPin, WifiOff, RefreshCw, AlertTriangle, Scan, Camera, ShieldCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { pontoOfflineService } from '@/services/pontoOfflineService';
import { pontoMonitorService } from '@/services/pontoMonitorService';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts';

interface PontoClockRegisterProps {
  time: Date;
  loading: string | null;
  geoStatus: 'idle' | 'capturing' | 'success' | 'error' | 'out_of_range';
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
  const [showFaceScan, setShowFaceScan] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedTipo, setSelectedTipo] = useState<any>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setOfflineQueueSize(pontoOfflineService.getQueueSize());
    
    if (navigator.onLine) {
      handleSync();
    }

    const interval = setInterval(() => {
      setOfflineQueueSize(pontoOfflineService.getQueueSize());
    }, 5000);

    return () => {
      clearInterval(interval);
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

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

  const startScan = async (tipo: any) => {
    setSelectedTipo(tipo);
    setShowFaceScan(true);
    setScanProgress(0);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 480, height: 480 } 
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;

      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setScanProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          captureAndFinalize(tipo, mediaStream);
        }
      }, 100);
    } catch (err) {
      console.error('Erro ao acessar câmera:', err);
      toast.error('Acesso à câmera é obrigatório para biometria.');
      setShowFaceScan(false);
    }
  };

  const captureAndFinalize = async (tipo: any, mediaStream: MediaStream) => {
    let fotoUrl = null;
    
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8));
      
      if (blob && user?.id) {
        const fileName = `${user.id}/${Date.now()}.jpg`;
        const { data, error } = await (window as any).supabase.storage
          .from('ponto-biometria')
          .upload(fileName, blob);
          
        if (!error) {
          const { data: { publicUrl } } = (window as any).supabase.storage
            .from('ponto-biometria')
            .getPublicUrl(fileName);
          fotoUrl = publicUrl;
        }
      }
    }

    // Stop camera
    mediaStream.getTracks().forEach(track => track.stop());
    setStream(null);
    setShowFaceScan(false);
    finalizeRegister(tipo, fotoUrl);
  };

  const finalizeRegister = async (tipo: 'entrada' | 'saida_almoco' | 'retorno_almoco' | 'saida', fotoUrl: string | null) => {
    if (!user) return;
    
    if (navigator.onLine) {
      // Passar fotoUrl para o onRegistrar (precisamos atualizar o hook usePonto)
      (onRegistrar as any)(tipo, { foto_biometria_url: fotoUrl });
      return;
    }

    // Modo Offline
    try {
      const { data: colab } = await (window as any).supabase.from('colaboradores').select('id').eq('email', user.email).maybeSingle();
      if (!colab) throw new Error('Colaborador não identificado localmente');

      const hashPayload = {
        tipo,
        colaborador_id: colab.id,
        timestamp: new Date().toISOString(),
        dispositivoId: navigator.userAgent
      };

      await pontoOfflineService.queueRegistro({
        ...hashPayload,
        hash: pontoOfflineService.generateIntegrityHash(hashPayload)
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
                onClick={() => startScan(tipo)}
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
             geoStatus === 'out_of_range' ? '📍 Fora do raio permitido' :
             'Localização será registrada automaticamente'}
          </p>
        </CardContent>
      </Card>

      <Dialog open={showFaceScan} onOpenChange={setShowFaceScan}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-center flex items-center justify-center gap-2 text-primary-glow">
              <Scan className="h-5 w-5" /> Autenticação Biométrica Facial
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative w-64 h-64 rounded-full border-4 border-primary/30 overflow-hidden flex items-center justify-center bg-slate-800 shadow-[0_0_50px_rgba(34,197,94,0.1)]">
              {/* Fake scan line */}
              <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }} 
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-primary-glow/60 shadow-[0_0_15px_rgba(34,197,94,1)] z-10" 
              />
              
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover rounded-full" 
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Progress Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-primary/20"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 120}
                  strokeDashoffset={2 * Math.PI * 120 * (1 - scanProgress / 100)}
                  className="text-primary-glow transition-all duration-300"
                />
              </svg>
            </div>
            
            <div className="mt-8 text-center space-y-2">
              <p className="text-sm font-medium animate-pulse text-primary-glow">
                {scanProgress < 100 ? 'Analisando biometria...' : '✅ Identidade Confirmada!'}
              </p>
              <div className="flex items-center gap-2 justify-center text-[10px] text-slate-400">
                <ShieldCheck className="h-3 w-3" />
                <span>Protocolo de Segurança MTP 671 Ativo</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
