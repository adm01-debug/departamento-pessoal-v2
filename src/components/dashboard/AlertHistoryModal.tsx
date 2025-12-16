import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2, History, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AlertHistoryItem {
  id: string;
  tipo: string;
  nivel: string;
  valor: number;
  limite: number;
  mensagem: string;
  created_at: string;
}

interface AlertHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AlertHistoryModal({ open, onOpenChange }: AlertHistoryModalProps) {
  const [history, setHistory] = useState<AlertHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      loadHistory();
    }
  }, [open]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('historico_alertas')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'turnover':
        return <TrendingUp className="w-4 h-4" />;
      case 'absenteismo':
        return <Activity className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (tipo: string) => {
    switch (tipo) {
      case 'turnover':
        return 'Turnover';
      case 'absenteismo':
        return 'Absenteísmo';
      default:
        return tipo;
    }
  };

  const getLevelBadge = (nivel: string) => {
    switch (nivel) {
      case 'critical':
        return <Badge variant="destructive">Crítico</Badge>;
      case 'warning':
        return <Badge className="bg-warning text-warning-foreground">Alerta</Badge>;
      default:
        return <Badge variant="secondary">{nivel}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Histórico de Alertas
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <History className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm font-medium">Nenhum alerta registrado</p>
            <p className="text-xs">Os alertas aparecerão aqui quando forem disparados</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border ${
                    item.nivel === 'critical'
                      ? 'bg-destructive/5 border-destructive/20'
                      : 'bg-warning/5 border-warning/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          item.nivel === 'critical'
                            ? 'bg-destructive/20 text-destructive'
                            : 'bg-warning/20 text-warning'
                        }`}
                      >
                        {getTypeIcon(item.tipo)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {getTypeLabel(item.tipo)}
                          </span>
                          {getLevelBadge(item.nivel)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.mensagem}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Valor: {item.valor.toFixed(1)}%</span>
                          <span>Limite: {item.limite}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground whitespace-nowrap">
                      <div>{format(new Date(item.created_at), 'dd/MM/yyyy', { locale: ptBR })}</div>
                      <div>{format(new Date(item.created_at), 'HH:mm', { locale: ptBR })}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
