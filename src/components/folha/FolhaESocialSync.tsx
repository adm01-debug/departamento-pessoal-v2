import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Send, CheckCircle2, Clock, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';

interface ESocialEventStatus {
  event: string;
  status: 'pending' | 'sent' | 'accepted' | 'error';
  total: number;
  processed: number;
  lastUpdate?: string;
}

export function FolhaESocialSync({ competencia }: { competencia: string }) {
  const [isSyncing, setIsSyncing] = useState(false);

  // Mock data for eSocial events related to payroll
  const [events, setEvents] = useState<ESocialEventStatus[]>([
    { event: 'S-1200 - Remuneração', status: 'sent', total: 150, processed: 120, lastUpdate: '10/05/2026 14:30' },
    { event: 'S-1210 - Pagamentos', status: 'pending', total: 150, processed: 0 },
    { event: 'S-1299 - Fechamento', status: 'pending', total: 1, processed: 0 },
  ]);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('Sincronização com eSocial concluída!');
      setEvents(prev => prev.map(ev => 
        ev.event.includes('S-1200') ? { ...ev, status: 'accepted', processed: 150 } : ev
      ));
    }, 2000);
  };

  const getStatusIcon = (status: ESocialEventStatus['status']) => {
    switch (status) {
      case 'accepted': return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'sent': return <Clock className="h-4 w-4 text-info animate-pulse" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-destructive" />;
      default: return <Send className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: ESocialEventStatus['status']) => {
    switch (status) {
      case 'accepted': return <Badge variant="outline" className="bg-success/10 text-success border-success/20 font-body text-[10px]">Aceito</Badge>;
      case 'sent': return <Badge variant="outline" className="bg-info/10 text-info border-info/20 font-body text-[10px]">Transmitido</Badge>;
      case 'error': return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 font-body text-[10px]">Erro</Badge>;
      default: return <Badge variant="outline" className="bg-muted/10 text-muted-foreground border-border font-body text-[10px]">Pendente</Badge>;
    }
  };

  const overallProgress = (events.reduce((acc, ev) => acc + ev.processed, 0) / events.reduce((acc, ev) => acc + ev.total, 0)) * 100;

  return (
    <Card className="border border-border/30 rounded-2xl overflow-hidden shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-h3 font-display flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-info to-info/70">
            <Send className="h-4 w-4 text-primary-foreground" />
          </div>
          Integração eSocial
        </CardTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-xl h-8 w-8" 
          onClick={handleSync}
          disabled={isSyncing}
        >
          <RefreshCw className={cn("h-4 w-4 text-muted-foreground", isSyncing && "animate-spin")} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-body text-muted-foreground">
            <span>Progresso Geral de Transmissão</span>
            <span>{overallProgress.toFixed(0)}%</span>
          </div>
          <Progress value={overallProgress} className="h-1.5" />
        </div>

        <div className="space-y-3">
          {events.map((ev, i) => (
            <motion.div 
              key={ev.event}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {getStatusIcon(ev.status)}
                  <span className="text-body font-body font-medium">{ev.event}</span>
                </div>
                {getStatusBadge(ev.status)}
              </div>
              <div className="flex items-center justify-between pl-6 text-[11px] font-body text-muted-foreground">
                <span>{ev.processed} de {ev.total} colaboradores</span>
                {ev.lastUpdate && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {ev.lastUpdate}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <Button 
          variant="outline" 
          className="w-full rounded-xl gap-2 font-body text-xs border-info/20 text-info hover:bg-info/5 h-9"
          onClick={() => window.open('/esocial', '_blank')}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Painel de Eventos Completo
        </Button>
      </CardContent>
    </Card>
  );
}
