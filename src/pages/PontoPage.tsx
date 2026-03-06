// V15-227: src/pages/PontoPage.tsx
import { useState } from 'react';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, LogIn, Coffee, LogOut } from 'lucide-react';
import { pontoService } from '@/services';
import { useNotification } from '@/contexts';

export default function PontoPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const { success, error } = useNotification();

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
    { tipo: 'entrada' as const, label: 'Entrada', icon: LogIn, color: 'bg-green-600 hover:bg-green-700' },
    { tipo: 'saida_almoco' as const, label: 'Saída Almoço', icon: Coffee, color: 'bg-yellow-600 hover:bg-yellow-700' },
    { tipo: 'retorno_almoco' as const, label: 'Retorno Almoço', icon: Coffee, color: 'bg-blue-600 hover:bg-blue-700' },
    { tipo: 'saida' as const, label: 'Saída', icon: LogOut, color: 'bg-red-600 hover:bg-red-700' },
  ];

  return (
    <PageLayout title="Ponto Eletrônico" description="Registre sua jornada de trabalho">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Registrar Ponto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-center mb-6">{new Date().toLocaleTimeString('pt-BR')}</div>
            <div className="grid grid-cols-2 gap-4">
              {buttons.map(({ tipo, label, icon: Icon, color }) => (
                <Button key={tipo} onClick={() => registrar(tipo)} disabled={loading !== null} className={`${color} text-white`}>
                  <Icon className="h-4 w-4 mr-2" />
                  {loading === tipo ? 'Registrando...' : label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Registros de Hoje</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Nenhum registro encontrado</p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
