// V15-511
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGeolocation } from '@/hooks';
import { useRegistrarPonto } from '@/queries/ponto';
import { useNotification } from '@/contexts';
import { Clock, LogIn, Coffee, LogOut, MapPin } from 'lucide-react';
import type { TipoRegistro } from '@/types';
const tipos: { tipo: TipoRegistro; label: string; icon: any; color: string }[] = [{ tipo: 'entrada', label: 'Entrada', icon: LogIn, color: 'text-green-600' }, { tipo: 'saida_almoco', label: 'Saída Almoço', icon: Coffee, color: 'text-yellow-600' }, { tipo: 'retorno_almoco', label: 'Retorno', icon: Coffee, color: 'text-blue-600' }, { tipo: 'saida', label: 'Saída', icon: LogOut, color: 'text-red-600' }];
interface PontoRegistroProps { colaboradorId: string; }
export function PontoRegistro({ colaboradorId }: PontoRegistroProps) {
  const { latitude, longitude, loading: geoLoading } = useGeolocation();
  const registrar = useRegistrarPonto();
  const { success, error } = useNotification();
  const handleRegistrar = async (tipo: TipoRegistro) => { try { const coords = latitude && longitude ? { lat: latitude, lng: longitude } : undefined; await registrar.mutateAsync({ colaboradorId, tipo, coords }); success(`${tipos.find(t => t.tipo === tipo)?.label} registrado!`); } catch (err: any) { error('Erro ao registrar', err.message); } };
  return (
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />Registrar Ponto</CardTitle></CardHeader><CardContent>
      <div className="text-center mb-6"><p className="text-4xl font-bold">{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p><p className="text-muted-foreground">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>{latitude && longitude && <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1"><MapPin className="h-3 w-3" />Localização capturada</p>}</div>
      <div className="grid grid-cols-2 gap-4">{tipos.map(t => (<Button key={t.tipo} variant="outline" className="h-20 flex-col" onClick={() => handleRegistrar(t.tipo)} disabled={registrar.isPending}><t.icon className={`h-6 w-6 mb-1 ${t.color}`} />{t.label}</Button>))}</div>
    </CardContent></Card>
  );
}
