import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, User, Fingerprint, MapPin, Camera } from 'lucide-react';
import { PageLayout } from '@/components/layout';
import { toast } from 'sonner';
import { pontoService } from '@/services/pontoService';
import { supabase } from '@/integrations/supabase/client';

export default function PontoKioskPage() {
  const [time, setTime] = useState(new Date());
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'pin' | 'action' | 'success'>('pin');
  const [selectedColab, setSelectedColab] = useState<any>(null);

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
      setStep('action');
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
      await pontoService.registrar(tipo, selectedColab.id, { 
        dispositivoId: 'KIOSK-01',
        latitude: -23.5505, // Simulated kiosk location
        longitude: -46.6333
      });
      setStep('success');
      setTimeout(() => {
        setStep('pin');
        setPin('');
        setSelectedColab(null);
      }, 3000);
      toast.success('Ponto registrado com sucesso!');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Modo Quiosque" description="Registro rápido para múltiplos colaboradores" icon={<Fingerprint className="h-5 w-5" />} hideSidebar>
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
    </PageLayout>
  );
}
