import { PageTitle } from '@/components/PageTitle';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, RefreshCw, Loader2, AlertCircle, Settings } from 'lucide-react';
import { pontoService, batidasPontoService } from '@/services';
import { useAuth } from '@/contexts';
import { useEmpresas } from '@/hooks';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { GestaoRegistrosPonto } from '@/components/ponto/GestaoRegistrosPonto';
import { PontoStreakCard } from '@/components/ponto/PontoStreakCard';
import { PontoCharts } from '@/components/ponto/PontoCharts';
import { PontoClockRegister } from '@/components/ponto/PontoClockRegister';
import { PontoTodayCard } from '@/components/ponto/PontoTodayCard';
import { PontoWeekSummary } from '@/components/ponto/PontoWeekSummary';
import { PontoAdjustmentRequests } from '@/components/ponto/PontoAdjustmentRequests';
import { edgeFunctionsService } from '@/services/edgeFunctionsService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PontoAuditTimeline } from '@/components/ponto/PontoAuditTimeline';

export default function PontoPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());
  const [geoStatus, setGeoStatus] = useState<'idle' | 'capturing' | 'success' | 'error' | 'out_of_range'>('idle');
  const [processando, setProcessando] = useState(false);
  const { user } = useAuth();
  const { empresaAtual } = useEmpresas();

  const { data: locaisTrabalho } = useQuery({
    queryKey: ['locais-trabalho-ponto', empresaAtual?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('locais_trabalho').select('*').eq('empresa_id', empresaAtual?.id).eq('ativo', true);
      if (error) throw error;
      return data;
    },
    enabled: !!empresaAtual?.id
  });

  useEffect(() => { const i = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(i); }, []);
  const today = new Date().toISOString().split('T')[0];

  const { data: registroHoje, refetch: refetchRegistro } = useQuery({
    queryKey: ['registro-ponto-hoje', user?.id, today],
    queryFn: async () => { if (!user?.id) return null; const { data: colab } = await supabase.from('colaboradores').select('id').eq('email', user.email || '').maybeSingle(); if (!colab) return null; const { data, error } = await (supabase as any).from('registros_ponto').select('*').eq('colaborador_id', colab.id).eq('data', today).maybeSingle(); if (error) throw error; return data; },
    enabled: !!user?.id, refetchInterval: 30000,
  });

  const { data: batidasHoje = [], refetch: refetchBatidas } = useQuery({ queryKey: ['batidas-hoje', empresaAtual?.id, today], queryFn: () => batidasPontoService.listarPorData(today, empresaAtual?.id), enabled: !!empresaAtual?.id, refetchInterval: 30000 });

  const { data: registrosSemana = [] } = useQuery({
    queryKey: ['registros-semana', user?.id],
    queryFn: async () => { if (!user?.id) return []; const { data: colab } = await supabase.from('colaboradores').select('id').eq('email', user.email || '').maybeSingle(); if (!colab) return []; const w = new Date(); w.setDate(w.getDate() - 7); const { data, error } = await (supabase as any).from('registros_ponto').select('*').eq('colaborador_id', colab.id).gte('data', w.toISOString().split('T')[0]).order('data', { ascending: false }); if (error) throw error; return data || []; },
    enabled: !!user?.id,
  });

  const captureGeo = (): Promise<{ lat: number; lng: number, accuracy: number } | null> => new Promise((resolve) => {
    if (!navigator.geolocation) { resolve(null); return; }
    setGeoStatus('capturing');
    navigator.geolocation.getCurrentPosition(
      pos => { 
        setGeoStatus('success'); 
        resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }); 
      }, 
      () => { setGeoStatus('error'); resolve(null); }, 
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // in metres
  };

  const registrar = async (tipo: 'entrada' | 'saida_almoco' | 'retorno_almoco' | 'saida') => {
    setLoading(tipo);
    try { 
      const geo = await captureGeo(); 
      if (!user?.id) throw new Error('Usuário não autenticado');

      // Geofencing Check
      if (geo && locaisTrabalho && locaisTrabalho.length > 0) {
        const isWithinRange = locaisTrabalho.some(local => {
          if (!local.latitude || !local.longitude) return false;
          const dist = calculateDistance(geo.lat, geo.lng, Number(local.latitude), Number(local.longitude));
          return dist <= 500; // 500 meters radius
        });

        if (!isWithinRange) {
          setGeoStatus('out_of_range');
          toast.warning('Você está fora do raio permitido para registro de ponto presencial.');
          // In a "10/10" app, we might still allow but flag it for review
        }
      }
      
      const { data: colab } = await supabase.from('colaboradores').select('id').eq('email', user.email || '').maybeSingle();
      if (!colab) throw new Error('Colaborador não encontrado');

      await pontoService.registrar(tipo, colab.id, {
        latitude: geo?.lat,
        longitude: geo?.lng,
        precisao: geo?.accuracy ? Math.round(geo.accuracy) : undefined,
        dispositivoId: navigator.userAgent,
        metadata: geoStatus === 'out_of_range' ? { out_of_range: true } : undefined
      }); 
      
      toast.success(`Ponto registrado: ${tipo.replace(/_/g, ' ')} às ${new Date().toLocaleTimeString('pt-BR')}${geo ? ` (📍 ${geo.lat.toFixed(4)}, ${geo.lng.toFixed(4)})` : ''}`); 
      refetchRegistro(); 
      refetchBatidas(); 
    } catch (e: any) { 
      toast.error(`Erro: ${e.message}`); 
    } finally { 
      setLoading(null); 
      setTimeout(() => setGeoStatus('idle'), 3000); 
    }
  };

  const processarPontoServidor = async () => {
    if (!empresaAtual?.id) return; setProcessando(true);
    try { const w = new Date(); w.setDate(w.getDate() - 7); await edgeFunctionsService.processarPonto({ empresaId: empresaAtual.id, dataInicio: w.toISOString().split('T')[0], dataFim: new Date().toISOString().split('T')[0] }); toast.success('Ponto processado!'); refetchRegistro(); refetchBatidas(); } catch (e: any) { toast.error(`Erro: ${e.message}`); } finally { setProcessando(false); }
  };

  return (
    <>
      <PageTitle title="Registro de Ponto" description="Controle de ponto eletrônico" />
      <PageLayout 
        title="Ponto Eletrônico" 
        description="Registre e acompanhe sua jornada" 
        icon={<Clock className="h-5 w-5 text-primary-foreground" />} 
        gradient="from-primary/60 to-primary/90"
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="rounded-xl gap-1.5 font-body" onClick={() => window.open('/ponto/kiosk', '_blank')}>
              <Settings className="h-4 w-4" /> Kiosk Mode
            </Button>
            <Button size="sm" variant="outline" className="rounded-xl gap-1.5 font-body" onClick={processarPontoServidor} disabled={processando}>
              {processando ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              <span className="hidden sm:inline">Processar Servidor</span>
            </Button>
          </div>
        }
      >
        <Tabs defaultValue="meu-ponto" className="space-y-6">
          <TabsList className="bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="meu-ponto" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Meu Ponto</TabsTrigger>
            <TabsTrigger value="gestao" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Gestão da Equipe</TabsTrigger>
          </TabsList>

          <TabsContent value="meu-ponto" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <PontoClockRegister time={time} loading={loading} geoStatus={geoStatus} onRegistrar={registrar} />
              <PontoTodayCard registroHoje={registroHoje} />
              <PontoWeekSummary registrosSemana={registrosSemana} />
            </div>
            <div className="mt-6"><PontoStreakCard /></div>
            <PontoCharts />
          </TabsContent>

          <TabsContent value="gestao" className="space-y-6">
            <div className="grid gap-6">
              <PontoAdjustmentRequests />
            </div>

            <GestaoRegistrosPonto />
            <PontoAuditTimeline />
          </TabsContent>
        </Tabs>

        {batidasHoje.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6">
            <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
              <div className="h-[2px] bg-gradient-to-r from-primary-glow to-primary" />
              <CardHeader><CardTitle className="font-display flex items-center gap-2"><MapPin className="h-4 w-4 text-warning" /> Batidas Recentes</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow className="bg-muted/30 hover:bg-muted/30"><TableHead className="font-display font-semibold">Colaborador</TableHead><TableHead className="font-display font-semibold">Hora</TableHead><TableHead className="font-display font-semibold">Tipo</TableHead><TableHead className="font-display font-semibold">Ordem</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {batidasHoje.slice(0, 5).map((b: any) => (
                      <TableRow key={b.id} className="hover:bg-accent/30 transition-colors">
                        <TableCell className="font-body font-medium">{(b as any).colaborador?.nome_completo || b.colaborador_id?.slice(0, 8)}</TableCell>
                        <TableCell className="font-body font-mono">{b.hora}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{b.tipo}</Badge></TableCell>
                        <TableCell className="font-body">{b.ordem}ª</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </PageLayout>
    </>
  );
}
