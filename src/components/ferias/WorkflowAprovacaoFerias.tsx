import { useState } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { FeriasComColaborador, StatusFerias, HistoricoFerias } from '@/types/ferias';
import { useFeriasMelhorado } from '@/hooks/useFeriasMelhorado';
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
};

export function WorkflowAprovacaoFerias({ ferias, open, onOpenChange }: WorkflowAprovacaoFeriasProps) {
  const { 
    aprovarFerias, 
    rejeitarFerias, 
    iniciarGozo, 
    concluirFerias,
    useHistoricoFerias 
  } = useFeriasMelhorado();
  
  const { data: historico, isLoading: loadingHistorico } = useHistoricoFerias(ferias.id);
  
  const [motivoRejeicao, setMotivoRejeicao] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [acaoPendente, setAcaoPendente] = useState<'aprovar' | 'rejeitar' | 'iniciar' | 'concluir' | null>(null);
  const [historicoOpen, setHistoricoOpen] = useState(false);

  const config = statusConfig[ferias.status];
  const StatusIcon = config.icon;

  const diasParaInicio = differenceInDays(parseISO(ferias.data_inicio), new Date());
  const diasFerias = ferias.dias_gozo + (ferias.vender_abono ? ferias.dias_abono : 0);

  const handleAcao = (acao: typeof acaoPendente) => {
    if (acao === 'rejeitar') {
      setAcaoPendente(acao);
      setConfirmDialogOpen(true);
    } else {
      setAcaoPendente(acao);
      setConfirmDialogOpen(true);
    }
  };

  const executarAcao = () => {
    switch (acaoPendente) {
      case 'aprovar':
        aprovarFerias({ feriasId: ferias.id });
        break;
      case 'rejeitar':
        rejeitarFerias({ feriasId: ferias.id, motivo: motivoRejeicao });
        break;
      case 'iniciar':
        iniciarGozo(ferias.id);
        break;
      case 'concluir':
        concluirFerias(ferias.id);
        break;
    }
    setConfirmDialogOpen(false);
    setAcaoPendente(null);
    setMotivoRejeicao('');
    onOpenChange(false);
  };

  // Determinar ações disponíveis
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
            {/* Colaborador */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{ferias.colaborador_nome}</p>
                <p className="text-sm text-muted-foreground">
                  {ferias.colaborador_cargo} • {ferias.colaborador_departamento}
                </p>
              </div>
            </div>

            {/* Período */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Início</p>
                <p className="font-semibold">
                  {format(parseISO(ferias.data_inicio), "dd/MM/yyyy", { locale: ptBR })}
                </p>
                {diasParaInicio > 0 && (
                  <p className="text-xs text-muted-foreground">em {diasParaInicio} dias</p>
                )}
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Término</p>
                <p className="font-semibold">
                  {format(parseISO(ferias.data_fim), "dd/MM/yyyy", { locale: ptBR })}
                </p>
                <p className="text-xs text-muted-foreground">{ferias.dias_gozo} dias</p>
              </div>
            </div>

            {/* Valores */}
            <div className="p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <p className="font-medium text-sm">Valores</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Férias ({ferias.dias_gozo}d)</span>
                  <span>{formatCurrency(ferias.valor_ferias)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">1/3 Constitucional</span>
                  <span>{formatCurrency(ferias.valor_terco)}</span>
                </div>
                {ferias.vender_abono && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Abono ({ferias.dias_abono}d)</span>
                      <span>{formatCurrency(ferias.valor_abono)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">1/3 Abono</span>
                      <span>{formatCurrency(ferias.valor_terco_abono)}</span>
                    </div>
                  </>
                )}
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total Bruto</span>
                  <span>{formatCurrency(ferias.valor_total)}</span>
                </div>
                <div className="flex justify-between text-destructive">
                  <span>INSS</span>
                  <span>-{formatCurrency(ferias.descontos_inss)}</span>
                </div>
                <div className="flex justify-between text-destructive">
                  <span>IRRF</span>
                  <span>-{formatCurrency(ferias.descontos_irrf)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Líquido</span>
                  <span className="text-success">{formatCurrency(ferias.valor_liquido)}</span>
                </div>
              </div>
            </div>

            {/* Observações */}
            {ferias.observacoes && (
              <div className="p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium text-sm">Observações</p>
                </div>
                <p className="text-sm text-muted-foreground">{ferias.observacoes}</p>
              </div>
            )}

            {/* Histórico */}
            <Collapsible open={historicoOpen} onOpenChange={setHistoricoOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Histórico
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    historicoOpen && "rotate-180"
                  )} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="pt-2 space-y-2">
                  {loadingHistorico ? (
                    <div className="text-center py-4">
                      <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                    </div>
                  ) : historico && historico.length > 0 ? (
                    historico.map((h) => (
                      <div
                        key={h.id}
                        className="flex items-start gap-3 p-2 rounded bg-muted/20"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {h.status_novo.replace('_', ' ')}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {format(parseISO(h.created_at), "dd/MM HH:mm")}
                            </span>
                          </div>
                          {h.observacao && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {h.observacao}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      Nenhum histórico registrado
                    </p>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Ações */}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            {acoesDisponiveis.rejeitar && (
              <Button
                variant="destructive"
                onClick={() => handleAcao('rejeitar')}
                className="gap-2"
              >
                <XCircle className="w-4 h-4" />
                Rejeitar
              </Button>
            )}
            {acoesDisponiveis.aprovar && (
              <Button
                onClick={() => handleAcao('aprovar')}
                className="gap-2 bg-success hover:bg-success/90"
              >
                <CheckCircle className="w-4 h-4" />
                Aprovar
              </Button>
            )}
            {acoesDisponiveis.iniciar && (
              <Button
                onClick={() => handleAcao('iniciar')}
                className="gap-2"
              >
                <Calendar className="w-4 h-4" />
                Iniciar Gozo
              </Button>
            )}
            {acoesDisponiveis.concluir && (
              <Button
                onClick={() => handleAcao('concluir')}
                className="gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Concluir
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Confirmação */}
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

          {acaoPendente === 'aprovar' && (
            <p className="text-sm text-muted-foreground">
              As férias de <strong>{ferias.colaborador_nome}</strong> serão aprovadas.
              O pagamento deverá ser realizado até 2 dias antes do início.
            </p>
          )}

          {acaoPendente === 'iniciar' && (
            <p className="text-sm text-muted-foreground">
              O status será alterado para "Em Gozo". 
              O colaborador estará oficialmente de férias.
            </p>
          )}

          {acaoPendente === 'concluir' && (
            <p className="text-sm text-muted-foreground">
              As férias serão marcadas como concluídas e o período aquisitivo será baixado.
            </p>
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
}
