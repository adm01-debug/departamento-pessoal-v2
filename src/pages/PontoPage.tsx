import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, LogIn, Coffee, LogOut } from 'lucide-react';
import { pontoService } from '@/services';
import { useNotification } from '@/contexts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function PontoPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());
  const { success, error } = useNotification();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const registrar = async (tipo: 'entrada' | 'saida_almoco' | 'retorno_almoco' | 'saida') => {
    setLoading(tipo);
    try {
      let coords: { lat: number; lng: number } | undefined;
      if (navigator.geolocation) {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        ).catch(() => null);
        if (pos) coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      }
      await pontoService.registrar(tipo, 'user-id');
      success('Ponto registrado!', `${tipo.replace('_', ' ')} às ${new Date().toLocaleTimeString('pt-BR')}`);
    } catch (err: any) {
      error('Erro ao registrar ponto', err.message);
    } finally {
      setLoading(null);
    }
  };

  const buttons = [
    { tipo: 'entrada' as const, label: 'Entrada', icon: LogIn, gradient: 'from-success to-finance' },
    { tipo: 'saida_almoco' as const, label: 'Saída Almoço', icon: Coffee, gradient: 'from-warning to-coins' },
    { tipo: 'retorno_almoco' as const, label: 'Retorno Almoço', icon: Coffee, gradient: 'from-info to-level' },
    { tipo: 'saida' as const, label: 'Saída', icon: LogOut, gradient: 'from-destructive to-streak' },
  ];

  return (
    <PageLayout
      title="Ponto Eletrônico"
      description="Registre sua jornada de trabalho"
      icon={<Clock className="h-5 w-5 text-white" />}
      gradient="from-streak to-warning"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-streak to-warning" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 font-display">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-streak to-warning">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                Registrar Ponto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-display font-bold text-center mb-8 tabular-nums bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {time.toLocaleTimeString('pt-BR')}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {buttons.map(({ tipo, label, icon: Icon, gradient }) => (
                  <Button
                    key={tipo}
                    onClick={() => registrar(tipo)}
                    disabled={loading !== null}
                    className={cn(
                      'h-12 rounded-xl bg-gradient-to-r text-white hover:opacity-90 shadow-lg transition-all font-body font-medium',
                      gradient
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {loading === tipo ? 'Registrando...' : label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-info to-level" />
            <CardHeader>
              <CardTitle className="font-display">Registros de Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8">
                <div className="p-3 rounded-2xl bg-muted/50 mb-3">
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground font-body">Nenhum registro encontrado</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageLayout>
  );
}
