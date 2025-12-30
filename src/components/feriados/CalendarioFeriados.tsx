import { useState, memo } from 'react';
import { format, startOfYear, endOfYear, eachMonthOfInterval, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFeriados, Feriado } from '@/hooks/useFeriados';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
  Trash2,
  MapPin,
  Flag,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ESTADOS_BR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export const CalendarioFeriados = memo(function CalendarioFeriados() {
  const [ano, setAno] = useState(new Date().getFullYear());
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());
  const [novoFeriadoOpen, setNovoFeriadoOpen] = useState(false);
  const [novoFeriado, setNovoFeriado] = useState({
    data: '',
    descricao: '',
    tipo: 'municipal' as 'nacional' | 'estadual' | 'municipal',
    uf: '',
    cidade: '',
  });

  const {
    feriados,
    isLoading,
    sincronizarFeriados,
    isSincronizando,
    adicionarFeriado,
    removerFeriado,
  } = useFeriados(ano);

  const meses = eachMonthOfInterval({
    start: startOfYear(new Date(ano, 0, 1)),
    end: endOfYear(new Date(ano, 0, 1)),
  });

  const diasDoMes = eachDayOfInterval({
    start: startOfMonth(new Date(ano, mesSelecionado, 1)),
    end: endOfMonth(new Date(ano, mesSelecionado, 1)),
  });

  const getFeriadoDia = (data: Date): Feriado | undefined => {
    const dataStr = format(data, 'yyyy-MM-dd');
    return feriados.find(f => f.data === dataStr);
  };

  const handleAdicionarFeriado = () => {
    if (!novoFeriado.data || !novoFeriado.descricao) return;
    
    adicionarFeriado({
      data: novoFeriado.data,
      descricao: novoFeriado.descricao,
      tipo: novoFeriado.tipo,
      uf: novoFeriado.uf || undefined,
      cidade: novoFeriado.cidade || undefined,
    });
    
    setNovoFeriadoOpen(false);
    setNovoFeriado({
      data: '',
      descricao: '',
      tipo: 'municipal',
      uf: '',
      cidade: '',
    });
  };

  const feriadosDoMes = feriados.filter(f => {
    const feriadoDate = new Date(f.data + 'T00:00:00');
    return feriadoDate.getMonth() === mesSelecionado;
  });

  const getBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case 'nacional': return 'default';
      case 'estadual': return 'secondary';
      case 'municipal': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setAno(ano - 1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-2xl font-bold">{ano}</h2>
          <Button variant="outline" size="icon" onClick={() => setAno(ano + 1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => sincronizarFeriados(ano)} disabled={isSincronizando}>
            <RefreshCw className={cn("w-4 h-4 mr-2", isSincronizando && "animate-spin")} />
            Sincronizar {ano}
          </Button>
          
          <Dialog open={novoFeriadoOpen} onOpenChange={setNovoFeriadoOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Feriado
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Feriado</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Data</Label>
                  <Input type="date" value={novoFeriado.data} onChange={(e) => setNovoFeriado({ ...novoFeriado, data: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Input value={novoFeriado.descricao} onChange={(e) => setNovoFeriado({ ...novoFeriado, descricao: e.target.value })} placeholder="Nome do feriado" />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={novoFeriado.tipo} onValueChange={(v) => setNovoFeriado({ ...novoFeriado, tipo: v as 'nacional' | 'estadual' | 'municipal' })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nacional">Nacional</SelectItem>
                      <SelectItem value="estadual">Estadual</SelectItem>
                      <SelectItem value="municipal">Municipal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(novoFeriado.tipo === 'estadual' || novoFeriado.tipo === 'municipal') && (
                  <div className="space-y-2">
                    <Label>Estado (UF)</Label>
                    <Select value={novoFeriado.uf} onValueChange={(v) => setNovoFeriado({ ...novoFeriado, uf: v })}>
                      <SelectTrigger><SelectValue placeholder="Selecione o estado" /></SelectTrigger>
                      <SelectContent>
                        {ESTADOS_BR.map(uf => (<SelectItem key={uf} value={uf}>{uf}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {novoFeriado.tipo === 'municipal' && (
                  <div className="space-y-2">
                    <Label>Cidade</Label>
                    <Input value={novoFeriado.cidade} onChange={(e) => setNovoFeriado({ ...novoFeriado, cidade: e.target.value })} placeholder="Nome da cidade" />
                  </div>
                )}
                <Button onClick={handleAdicionarFeriado} className="w-full">Adicionar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {format(new Date(ano, mesSelecionado), 'MMMM yyyy', { locale: ptBR })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-2 mb-4">
              {meses.map((mes, idx) => (
                <Button key={idx} variant={mesSelecionado === idx ? 'default' : 'outline'} size="sm" onClick={() => setMesSelecionado(idx)} className="text-xs">
                  {format(mes, 'MMM', { locale: ptBR })}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
                <div key={dia} className="text-center text-xs font-medium text-muted-foreground py-2">{dia}</div>
              ))}
              {Array.from({ length: diasDoMes[0].getDay() }).map((_, i) => (<div key={`empty-${i}`} />))}
              {diasDoMes.map(dia => {
                const feriado = getFeriadoDia(dia);
                const ehHoje = isToday(dia);
                return (
                  <div key={dia.toISOString()} className={cn("p-2 text-center rounded-lg relative", ehHoje && "ring-2 ring-primary", feriado && "bg-destructive/10", !feriado && "hover:bg-muted")} title={feriado?.descricao}>
                    <span className={cn("text-sm", feriado && "text-destructive font-medium")}>{format(dia, 'd')}</span>
                    {feriado && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-destructive" />}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Flag className="w-4 h-4" />
              Feriados de {format(new Date(ano, mesSelecionado), 'MMMM', { locale: ptBR })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {feriadosDoMes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum feriado neste mês</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {feriadosDoMes.map(feriado => (
                    <div key={feriado.id} className="p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{feriado.descricao}</p>
                          <p className="text-xs text-muted-foreground">{format(new Date(feriado.data + 'T00:00:00'), "EEEE, d 'de' MMMM", { locale: ptBR })}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={getBadgeVariant(feriado.tipo)}>{feriado.tipo}</Badge>
                            {feriado.uf && (<Badge variant="outline" className="text-xs"><MapPin className="w-3 h-3 mr-1" />{feriado.cidade ? `${feriado.cidade}/${feriado.uf}` : feriado.uf}</Badge>)}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removerFeriado(feriado.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2"><Badge variant="default">Nacional</Badge><span>Feriado nacional</span></div>
        <div className="flex items-center gap-2"><Badge variant="secondary">Estadual</Badge><span>Feriado estadual</span></div>
        <div className="flex items-center gap-2"><Badge variant="outline">Municipal</Badge><span>Feriado municipal</span></div>
      </div>
    </div>
  );
});
