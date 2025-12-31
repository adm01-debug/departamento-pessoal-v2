import { useState, memo } from 'react';
import { 
  CheckCircle, XCircle, Clock, AlertTriangle, History, 
  User, Calendar, DollarSign, FileText, Loader2, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { FeriasComColaborador, StatusFerias, HistoricoFerias } from '@/types/ferias';
import { useFeriasMelhorado } from '@/hooks/useFeriasMelhorado';
import { useHistoricoRegistro } from '@/hooks/useAuditoria';
import { format, parseISO, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/lib/calculosTrabalhistas';

interface WorkflowAprovacaoFeriasProps {
  ferias: FeriasComColaborador;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusConfig: Record<StatusFerias, { label: string; icon: React.ElementType; color: string }> = {
  programada: { label: 'Programada', icon: Clock, color: 'text-warning' },
  aprovada: { label: 'Aprovada', icon: CheckCircle, color: 'text-success' },
  em_gozo: { label: 'Em Gozo', icon: Calendar, color: 'text-info' },
  concluida: { label: 'Concluída', icon: CheckCircle, color: 'text-muted-foreground' },
  cancelada: { label: 'Cancelada', icon: XCircle, color: 'text-destructive' },
  rejeitada: { label: 'Rejeitada', icon: XCircle, color: 'text-destructive' },
  solicitada: { label: 'Solicitada', icon: Clock, color: 'text-amber-600' },
};

export const WorkflowAprovacaoFerias = memo(function WorkflowAprovacaoFerias({ ferias, open, onOpenChange }: WorkflowAprovacaoFeriasProps) {
  const { 
    aprovarFerias, 
    rejeitarFerias,
    atualizarFerias,
  } = useFeriasMelhorado();
  
  const { data: historico, isLoading: loadingHistorico } = useHistoricoRegistro('ferias', ferias.id);
  
  const [motivoRejeicao, setMotivoRejeicao] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [acaoPendente, setAcaoPendente] = useState<'aprovar' | 'rejeitar' | 'iniciar' | 'concluir' | null>(null);
  const [historicoOpen, setHistoricoOpen] = useState(false);

  const config = statusConfig[ferias.status] || statusConfig.programada;
  const StatusIcon = config.icon;

  const diasParaInicio = differenceInDays(parseISO(ferias.data_inicio), new Date());

  const handleAcao = (acao: typeof acaoPendente) => {
    setAcaoPendente(acao);
    setConfirmDialogOpen(true);
  };

  const executarAcao = async () => {
    switch (acaoPendente) {
      case 'aprovar':
        await aprovarFerias(ferias.id, 'current-user');
        break;
      case 'rejeitar':
        await rejeitarFerias(ferias.id, motivoRejeicao);
        break;
      case 'iniciar':
        await atualizarFerias(ferias.id, { status: 'em_gozo' });
        break;
      case 'concluir':
        await atualizarFerias(ferias.id, { status: 'concluida' });
        break;
    }
    setConfirmDialogOpen(false);
    setAcaoPendente(null);
    setMotivoRejeicao('');
    onOpenChange(false);
  };

  const acoesDisponiveis = {
    aprovar: ferias.status === 'programada',
    rejeitar: ferias.status === 'programada',
    iniciar: ferias.status === 'aprovada' && diasParaInicio <= 0,
    concluir: ferias.status === 'em_gozo',
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <StatusIcon className={cn("w-5 h-5", config.color)} />
              Detalhes das Férias
            </DialogTitle>
            <DialogDescription>
              <Badge className={cn("border-0", config.color === 'text-warning' && "bg-warning/10",
                config.color === 'text-success' && "bg-success/10",
                config.color === 'text-info' && "bg-info/10",
                config.color === 'text-destructive' && "bg-destructive/10",
                config.color)}>
                {config.label}
              </Badge>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{ferias.colaborador?.nome || 'N/A'}</p>
                <p className="text-sm text-muted-foreground">
                  Colaborador
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Início</p>
                <p className="font-semibold">
                  {format(parseISO(ferias.data_inicio), "dd/MM/yyyy", { locale: ptBR })}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Término</p>
                <p className="font-semibold">
                  {format(parseISO(ferias.data_fim), "dd/MM/yyyy", { locale: ptBR })}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <p className="font-medium text-sm">Valores</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Férias ({ferias.dias}d)</span>
                  <span>{formatCurrency(ferias.valor_ferias || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">1/3 Constitucional</span>
                  <span>{formatCurrency(ferias.valor_terco || 0)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Líquido</span>
                  <span className="text-success">{formatCurrency(ferias.valor_total || 0)}</span>
                </div>
              </div>
            </div>

            {ferias.observacoes && (
              <div className="p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium text-sm">Observações</p>
                </div>
                <p className="text-sm text-muted-foreground">{ferias.observacoes}</p>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {acoesDisponiveis.rejeitar && (
              <Button variant="destructive" onClick={() => handleAcao('rejeitar')} className="gap-2">
                <XCircle className="w-4 h-4" />
                Rejeitar
              </Button>
            )}
            {acoesDisponiveis.aprovar && (
              <Button onClick={() => handleAcao('aprovar')} className="gap-2 bg-success hover:bg-success/90">
                <CheckCircle className="w-4 h-4" />
                Aprovar
              </Button>
            )}
            {acoesDisponiveis.iniciar && (
              <Button onClick={() => handleAcao('iniciar')} className="gap-2">
                <Calendar className="w-4 h-4" />
                Iniciar Gozo
              </Button>
            )}
            {acoesDisponiveis.concluir && (
              <Button onClick={() => handleAcao('concluir')} className="gap-2">
                <CheckCircle className="w-4 h-4" />
                Concluir
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {acaoPendente === 'aprovar' && 'Aprovar Férias?'}
              {acaoPendente === 'rejeitar' && 'Rejeitar Férias?'}
              {acaoPendente === 'iniciar' && 'Iniciar Gozo de Férias?'}
              {acaoPendente === 'concluir' && 'Concluir Férias?'}
            </DialogTitle>
          </DialogHeader>

          {acaoPendente === 'rejeitar' && (
            <div className="space-y-2">
              <Label>Motivo da Rejeição *</Label>
              <Textarea
                placeholder="Informe o motivo..."
                value={motivoRejeicao}
                onChange={(e) => setMotivoRejeicao(e.target.value)}
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={executarAcao}
              disabled={acaoPendente === 'rejeitar' && !motivoRejeicao}
              className={acaoPendente === 'rejeitar' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});