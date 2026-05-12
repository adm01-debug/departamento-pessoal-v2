import { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, User, Fingerprint, MapPin, Camera, WifiOff, RefreshCw, Smartphone } from 'lucide-react';
import { PageLayout } from '@/components/layout';
import { toast } from 'sonner';
import { pontoService } from '@/services/pontoService';
import { pontoOfflineService } from '@/services/pontoOfflineService';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function PontoKioskPage() {
  const [time, setTime] = useState(new Date());
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'pin' | 'facial_scan' | 'action' | 'success'>('pin');
  const [selectedColab, setSelectedColab] = useState<any>(null);
  const [offlineQueueSize, setOfflineQueueSize] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setOfflineQueueSize(pontoOfflineService.getQueueSize());
    const interval = setInterval(() => {
      setOfflineQueueSize(pontoOfflineService.getQueueSize());
      if (navigator.onLine && !isSyncing && pontoOfflineService.getQueueSize() > 0) {
        handleSync();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [isSyncing]);

  const handleSync = async () => {
    if (isSyncing || !navigator.onLine) return;
    setIsSyncing(true);
    try {
      const result = await pontoOfflineService.syncOfflineQueue();
      if (result.synced > 0) {
        toast.success(`${result.synced} registros sincronizados automaticamente.`);
      }
    } catch (e) {
      console.error('Erro na sincronização do quiosque', e);
    } finally {
      setIsSyncing(false);
      setOfflineQueueSize(pontoOfflineService.getQueueSize());
    }
  };

  useEffect(() => { const i = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(i); }, []);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) return;
    setLoading(true);
    try {
      // Find colaborador by matricula or a dedicated PIN field (simulating with matricula)
      const { data: colab, error } = await supabase
        .from('colaboradores')
        .select('id, nome_completo, empresa_id')
        .eq('matricula', pin)
        .maybeSingle();

      if (error) throw error;
      if (!colab) throw new Error('PIN/Matrícula inválida');

      setSelectedColab(colab);
      setStep('facial_scan');
      speak(`Olá ${colab.nome_completo.split(' ')[0]}, olhe para a câmera para identificação facial.`);
      setTimeout(() => {
        setStep('action');
        speak(`Identidade confirmada. Selecione o tipo de registro.`);
      }, 3500);
    } catch (e: any) {
      toast.error(e.message);
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  const registrar = async (tipo: any) => {
    setLoading(true);
    try {
      const geo = {
        latitude: -23.5505, // Localização fixa do quiosque
        longitude: -46.6333,
        dispositivoId: 'KIOSK-01'
      };

      if (!navigator.onLine) {
        await pontoOfflineService.queueRegistro({
          tipo,
          colaborador_id: selectedColab.id,
          timestamp: new Date().toISOString(),
          dispositivoId: geo.dispositivoId,
          latitude: geo.latitude,
          longitude: geo.longitude
        });
        toast.warning('Ponto registrado em modo OFFLINE (Quiosque).');
      } else {
        await pontoService.registrar(tipo, selectedColab.id, geo);
        toast.success('Ponto registrado com sucesso!');
      }

      setStep('success');
      speak("Ponto registrado com sucesso. Bom trabalho!");
      setTimeout(() => {
        setStep('pin');
        setPin('');
        setSelectedColab(null);
      }, 3000);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
      setOfflineQueueSize(pontoOfflineService.getQueueSize());
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 font-body">
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-glow shadow-lg">
            <Fingerprint className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">Modo Quiosque</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-1.5">
              <Smartphone className="h-3.5 w-3.5" /> Estação de Registro Compartilhada
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {offlineQueueSize > 0 && (
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 px-3 py-1 gap-1.5 animate-pulse">
              <WifiOff className="h-3.5 w-3.5" /> {offlineQueueSize} pendentes
            </Badge>
          )}
          {!navigator.onLine && (
            <Badge variant="destructive" className="gap-1.5">
              <WifiOff className="h-3.5 w-3.5" /> Offline
            </Badge>
          )}
          {navigator.onLine && isSyncing && (
            <RefreshCw className="h-5 w-5 text-primary animate-spin" />
          )}
        </div>
      </div>
      <div className="max-w-md mx-auto mt-12">
        <div className="text-center mb-12">
          <div className="text-7xl font-display font-bold tabular-nums mb-2">
            {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <p className="text-muted-foreground font-body">
            {time.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
          </p>
        </div>

        {step === 'pin' && (
          <Card className="shadow-2xl border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="font-display">Digite seu PIN ou Matrícula</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePinSubmit} className="space-y-4">
                <Input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="0000"
                  className="text-center text-4xl h-16 tracking-[1em]"
                  autoFocus
                />
                <Button className="w-full h-14 text-lg font-display rounded-xl" disabled={loading}>
                  {loading ? 'Verificando...' : 'Confirmar'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 'facial_scan' && (
          <Card className="shadow-2xl border-primary/20 overflow-hidden relative group">
            <div className="h-80 bg-slate-900 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-primary/10" />
              
              {/* Scan Overlay */}
              <div className="relative w-64 h-64 border-2 border-primary/30 rounded-3xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 border-[1px] border-primary/20 rounded-3xl scale-95 animate-pulse" />
                <Camera className="h-16 w-16 text-primary/40" />
                
                {/* Scanning Bar */}
                <motion.div 
                  initial={{ top: 0 }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_rgba(var(--primary),0.5)] z-10"
                />

                {/* Face Mapping Dots */}
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-20">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-center">
                      <div className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: `${i * 0.05}s` }} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-6 left-0 right-0 text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                  <p className="text-white text-sm font-display font-medium tracking-widest uppercase">Processando Biometria</p>
                </div>
                <p className="text-primary/60 text-[10px] font-mono tracking-tighter">HASH: {Math.random().toString(16).slice(2, 10).toUpperCase()}</p>
              </div>
            </div>
            <div className="p-4 bg-white border-t border-primary/10 text-center">
               <p className="text-xs text-muted-foreground animate-pulse">Aguarde o reconhecimento do sistema...</p>
            </div>
          </Card>
        )}

        {step === 'action' && selectedColab && (
          <Card className="shadow-2xl border-primary/20">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <User className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-display">Olá, {selectedColab.nome_completo.split(' ')[0]}!</CardTitle>
              <p className="text-sm text-muted-foreground">O que deseja fazer agora?</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-24 flex-col gap-2 rounded-2xl" onClick={() => registrar('entrada')} disabled={loading}>
                  <Clock className="h-6 w-6 text-success" /> Entrada
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2 rounded-2xl" onClick={() => registrar('saida_almoco')} disabled={loading}>
                  <Clock className="h-6 w-6 text-warning" /> Saída Almoço
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2 rounded-2xl" onClick={() => registrar('retorno_almoco')} disabled={loading}>
                  <Clock className="h-6 w-6 text-info" /> Retorno Almoço
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2 rounded-2xl" onClick={() => registrar('saida')} disabled={loading}>
                  <Clock className="h-6 w-6 text-destructive" /> Saída
                </Button>
              </div>
              <Button variant="ghost" className="w-full mt-4" onClick={() => setStep('pin')}>Cancelar</Button>
            </CardContent>
          </Card>
        )}

        {step === 'success' && (
          <div className="text-center p-12 animate-in zoom-in duration-300">
            <div className="mx-auto w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mb-6">
              <Clock className="h-12 w-12 text-success animate-pulse" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-2">Ponto Registrado!</h2>
            <p className="text-muted-foreground">Bom trabalho, {selectedColab?.nome_completo.split(' ')[0]}.</p>
          </div>
        )}
      </div>
    </div>
  );
}
