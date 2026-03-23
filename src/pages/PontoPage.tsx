import { PageTitle } from '@/components/PageTitle';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, LogIn, Coffee, LogOut, MapPin, Timer, TrendingUp, AlertTriangle } from 'lucide-react';
import { pontoService, batidasPontoService } from '@/services';
import { useAuth } from '@/contexts';
import { useEmpresas } from '@/hooks';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { GestaoRegistrosPonto } from '@/components/ponto/GestaoRegistrosPonto';
import { PontoStreakCard } from '@/components/ponto/PontoStreakCard';
import { PontoCharts } from '@/components/ponto/PontoCharts';

export default function PontoPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());
  const [geoStatus, setGeoStatus] = useState<'idle' | 'capturing' | 'success' | 'error'>('idle');
  const { user } = useAuth();
  const { empresaAtual } = useEmpresas();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const today = new Date().toISOString().split('T')[0];

  // Fetch today's consolidated record
  const { data: registroHoje, refetch: refetchRegistro } = useQuery({
    queryKey: ['registro-ponto-hoje', user?.id, today],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data: colab } = await supabase.from('colaboradores').select('id').eq('email', user.email || '').maybeSingle();
      if (!colab) return null;
      const { data, error } = await (supabase as any).from('registros_ponto').select('*').eq('colaborador_id', colab.id).eq('data', today).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    refetchInterval: 30000,
  });

  // Fetch today's batidas
  const { data: batidasHoje = [], refetch: refetchBatidas } = useQuery({
    queryKey: ['batidas-hoje', empresaAtual?.id, today],
    queryFn: () => batidasPontoService.listarPorData(today, empresaAtual?.id),
    enabled: !!empresaAtual?.id,
    refetchInterval: 30000,
  });

  // Fetch week records for the logged user
  const { data: registrosSemana = [] } = useQuery({
    queryKey: ['registros-semana', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data: colab } = await supabase.from('colaboradores').select('id').eq('email', user.email || '').maybeSingle();
      if (!colab) return [];
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { data, error } = await (supabase as any).from('registros_ponto').select('*').eq('colaborador_id', colab.id).gte('data', weekAgo.toISOString().split('T')[0]).order('data', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const captureGeo = (): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      setGeoStatus('capturing');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGeoStatus('success');
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          setGeoStatus('error');
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  };

  const registrar = async (tipo: 'entrada' | 'saida_almoco' | 'retorno_almoco' | 'saida') => {
    setLoading(tipo);
    try {
      // Capture geolocation in parallel
      const geo = await captureGeo();
      await pontoService.registrar(tipo, user?.id);
      const geoMsg = geo ? ` (📍 ${geo.lat.toFixed(4)}, ${geo.lng.toFixed(4)})` : '';
      toast.success(`Ponto registrado: ${tipo.replace(/_/g, ' ')} às ${new Date().toLocaleTimeString('pt-BR')}${geoMsg}`);
      refetchRegistro();
      refetchBatidas();
    } catch (err: any) {
      toast.error(`Erro ao registrar ponto: ${err.message}`);
    } finally {
      setLoading(null);
      setTimeout(() => setGeoStatus('idle'), 2000);
    }
  };

  const buttons = [
    { tipo: 'entrada' as const, label: 'Entrada', icon: LogIn, gradient: 'from-primary to-primary-glow' },
    { tipo: 'saida_almoco' as const, label: 'Saída Almoço', icon: Coffee, gradient: 'from-primary-glow to-primary' },
    { tipo: 'retorno_almoco' as const, label: 'Retorno Almoço', icon: Coffee, gradient: 'from-primary to-primary-glow' },
    { tipo: 'saida' as const, label: 'Saída', icon: LogOut, gradient: 'from-destructive to-destructive/70/70' },
  ];

  const formatInterval = (val: any) => {
    if (!val) return '00:00';
    if (typeof val === 'string') {
      const match = val.match(/(\d+):(\d+)/);
      return match ? `${match[1].padStart(2, '0')}:${match[2].padStart(2, '0')}` : '00:00';
    }
    return '00:00';
  };

  const pares = registroHoje ? [
    { e: registroHoje.entrada_1, s: registroHoje.saida_1 },
    { e: registroHoje.entrada_2, s: registroHoje.saida_2 },
    { e: registroHoje.entrada_3, s: registroHoje.saida_3 },
    { e: registroHoje.entrada_4, s: registroHoje.saida_4 },
    { e: registroHoje.entrada_5, s: registroHoje.saida_5 },
    { e: registroHoje.entrada_6, s: registroHoje.saida_6 },
  ].filter(p => p.e || p.s) : [];

  return (
    <>
    <PageTitle title="Registro de Ponto" description="Controle de ponto eletrônico" />
    <PageLayout
      title="Ponto Eletrônico"
      description="Registre e acompanhe sua jornada de trabalho"
      icon={<Clock className="h-5 w-5 text-primary-foreground" />}
      gradient="from-primary/60 to-primary/90"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Clock & Register */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-primary/60 to-primary/90" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 font-display">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/60 to-primary/90">
                  <Clock className="h-4 w-4 text-primary-foreground" />
                </div>
                Registrar Ponto
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
                    onClick={() => registrar(tipo)}
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
              {/* Geo status indicator */}
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

        {/* Today's Record */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-primary to-primary-glow" />
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Timer className="h-4 w-4 text-info" /> Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              {registroHoje ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 rounded-xl bg-success/10 text-center">
                      <p className="text-lg font-display font-bold text-success">{formatInterval(registroHoje.horas_trabalhadas)}</p>
                      <p className="text-[10px] text-muted-foreground font-body">Trabalhadas</p>
                    </div>
                    <div className="p-2 rounded-xl bg-info/10 text-center">
                      <p className="text-lg font-display font-bold text-info">{formatInterval(registroHoje.horas_extras)}</p>
                      <p className="text-[10px] text-muted-foreground font-body">Extras</p>
                    </div>
                    <div className="p-2 rounded-xl bg-destructive/10 text-center">
                      <p className="text-lg font-display font-bold text-destructive">{formatInterval(registroHoje.horas_falta)}</p>
                      <p className="text-[10px] text-muted-foreground font-body">Falta</p>
                    </div>
                  </div>

                  {(registroHoje.atraso_minutos > 0 || registroHoje.saida_antecipada_minutos > 0) && (
                    <div className="flex gap-2">
                      {registroHoje.atraso_minutos > 0 && (
                        <Badge variant="destructive" className="text-xs gap-1">
                          <AlertTriangle className="h-3 w-3" /> Atraso: {registroHoje.atraso_minutos}min
                        </Badge>
                      )}
                      {registroHoje.saida_antecipada_minutos > 0 && (
                        <Badge variant="outline" className="text-xs gap-1">
                          Saída antecipada: {registroHoje.saida_antecipada_minutos}min
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground font-body">Registros ({registroHoje.total_batidas || 0} batidas)</p>
                    {pares.length > 0 ? pares.map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-success" />
                          <span className="text-sm font-body font-medium">{p.e || '--:--'}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">→</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-body font-medium">{p.s || '--:--'}</span>
                          <div className="w-2 h-2 rounded-full bg-destructive" />
                        </div>
                      </div>
                    )) : (
                      <p className="text-sm text-muted-foreground font-body text-center py-2">Aguardando registro</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="p-3 rounded-2xl bg-muted/50 mb-3">
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground font-body">Nenhum registro hoje</p>
                  <p className="text-xs text-muted-foreground/60 font-body mt-1">Registre sua entrada para começar</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Week Summary */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-primary to-primary-glow" />
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" /> Últimos 7 dias
              </CardTitle>
            </CardHeader>
            <CardContent>
              {registrosSemana.length > 0 ? (
                <div className="space-y-2">
                  {registrosSemana.slice(0, 7).map((r: any) => (
                    <div key={r.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="text-sm font-body font-medium">
                          {new Date(r.data + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-body">
                        <span className="text-success font-medium">{formatInterval(r.horas_trabalhadas)}</span>
                        {r.horas_extras && formatInterval(r.horas_extras) !== '00:00' && (
                          <Badge variant="outline" className="text-[10px] h-5 px-1.5 text-info">+{formatInterval(r.horas_extras)}</Badge>
                        )}
                        {r.atraso_minutos > 0 && (
                          <Badge variant="destructive" className="text-[10px] h-5 px-1.5">{r.atraso_minutos}m</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="p-3 rounded-2xl bg-muted/50 mb-3">
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground font-body">Sem registros recentes</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Streak & Monthly Stats */}
      <div className="mt-6">
        <PontoStreakCard />
      </div>

      {/* Charts */}
      <PontoCharts />

      {/* Team Batidas Today */}
      {batidasHoje.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6">
          <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-primary-glow to-primary" />
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <MapPin className="h-4 w-4 text-warning" /> Batidas da Equipe Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-display font-semibold">Colaborador</TableHead>
                    <TableHead className="font-display font-semibold">Hora</TableHead>
                    <TableHead className="font-display font-semibold">Tipo</TableHead>
                    <TableHead className="font-display font-semibold">Ordem</TableHead>
                    <TableHead className="font-display font-semibold">Origem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batidasHoje.slice(0, 20).map((b: any) => (
                    <TableRow key={b.id} className="hover:bg-accent/30 transition-colors">
                      <TableCell className="font-body font-medium">{b.colaborador?.nome_completo || '—'}</TableCell>
                      <TableCell className="font-body font-mono">{b.hora}</TableCell>
                      <TableCell>
                        <Badge variant={b.tipo === 'entrada' ? 'default' : 'secondary'} className="text-xs">
                          {b.tipo === 'entrada' ? '🟢 Entrada' : '🔴 Saída'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-body text-sm">{b.ordem}ª</TableCell>
                      <TableCell className="font-body text-sm">{b.origem || 'web'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Gestão de Ponto - Todos Colaboradores */}
      <GestaoRegistrosPonto />
    </PageLayout>
  );
}
