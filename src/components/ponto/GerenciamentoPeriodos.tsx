import { useState, memo } from 'react';
import { Lock, Unlock, Calendar, CheckCircle, AlertCircle, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { usePontoMelhorado } from '@/hooks/usePontoMelhorado';
import { useIntegracaoPontoFolha } from '@/hooks/useIntegracaoPontoFolha';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GerenciamentoPeriodosProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  competenciaAtual: string;
}

export const GerenciamentoPeriodos = memo(function GerenciamentoPeriodos({ open, onOpenChange, competenciaAtual }: GerenciamentoPeriodosProps) {
  const pontoMelhorado = usePontoMelhorado();
  const integracaoPontoFolha = useIntegracaoPontoFolha();
  
  const { data: periodos, isLoading: loadingPeriodos } = pontoMelhorado.usePeriodos();
  const { data: ajustesPendentes } = pontoMelhorado.useAjustesPendentes();
  
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [acaoPendente, setAcaoPendente] = useState<{ tipo: 'fechar' | 'reabrir' | 'exportar'; competencia: string } | null>(null);

  // Encontrar período atual
  const periodosArray = periodos as Array<{ competencia: string; status: string; id: string; fechado_em?: string }> | undefined;
  const periodoAtual = periodosArray?.find(p => p.competencia === competenciaAtual);
  const statusAtual = periodoAtual?.status || 'aberto';

  // Verificar se há ajustes pendentes na competência atual
  const ajustesArray = ajustesPendentes as Array<unknown> | undefined;
  const temAjustesPendentes = ajustesArray && ajustesArray.length > 0;

  const handleFechar = () => {
    if (temAjustesPendentes) {
      return;
    }
    setAcaoPendente({ tipo: 'fechar', competencia: competenciaAtual });
    setConfirmDialogOpen(true);
  };

  const handleReabrir = () => {
    setAcaoPendente({ tipo: 'reabrir', competencia: competenciaAtual });
    setConfirmDialogOpen(true);
  };

  const handleExportar = () => {
    setAcaoPendente({ tipo: 'exportar', competencia: competenciaAtual });
    setConfirmDialogOpen(true);
  };

  const handleConfirmar = async () => {
    if (!acaoPendente) return;

    try {
      if (acaoPendente.tipo === 'fechar') {
        pontoMelhorado.fecharPeriodo(acaoPendente.competencia);
      } else if (acaoPendente.tipo === 'reabrir') {
        pontoMelhorado.reabrirPeriodo(acaoPendente.competencia);
      } else if (acaoPendente.tipo === 'exportar') {
        integracaoPontoFolha.exportarParaFolha({ colaboradorId: '', mes: 0, ano: 0, processamento: {} as never });
      }
    } finally {
      setConfirmDialogOpen(false);
      setAcaoPendente(null);
    }
  };

  const formatCompetencia = (comp: string) => {
    const [ano, mes] = comp.split('-');
    return format(new Date(parseInt(ano), parseInt(mes) - 1), 'MMMM/yyyy', { locale: ptBR });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Gerenciar Períodos de Ponto
            </DialogTitle>
            <DialogDescription>
              Controle de abertura e fechamento de períodos
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Período Atual */}
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">Período Atual</p>
                  <p className="text-lg font-semibold capitalize">
                    {formatCompetencia(competenciaAtual)}
                  </p>
                </div>
                <Badge
                  className={cn(
                    "border-0",
                    statusAtual === 'aberto' && "bg-success/10 text-success",
                    statusAtual === 'fechado' && "bg-warning/10 text-warning",
                    statusAtual === 'processado' && "bg-info/10 text-info"
                  )}
                >
                  {statusAtual === 'aberto' && <Unlock className="w-3 h-3 mr-1" />}
                  {statusAtual === 'fechado' && <Lock className="w-3 h-3 mr-1" />}
                  {statusAtual === 'processado' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {statusAtual.charAt(0).toUpperCase() + statusAtual.slice(1)}
                </Badge>
              </div>

              {/* Alertas */}
              {temAjustesPendentes && statusAtual === 'aberto' && (
                <Alert variant="destructive" className="mb-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Existem {ajustesArray?.length} ajuste(s) pendente(s) de aprovação. 
                    Resolva antes de fechar o período.
                  </AlertDescription>
                </Alert>
              )}

              {/* Ações */}
              <div className="flex gap-2">
                {statusAtual === 'aberto' ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleFechar}
                      disabled={pontoMelhorado.isFechandoPeriodo || temAjustesPendentes}
                      className="flex-1 gap-2"
                    >
                      {pontoMelhorado.isFechandoPeriodo ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                      Fechar Período
                    </Button>
                    <Button
                      onClick={handleExportar}
                      disabled={integracaoPontoFolha.isExportando}
                      className="flex-1 gap-2"
                    >
                      {integracaoPontoFolha.isExportando ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Exportar p/ Folha
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleReabrir}
                    disabled={pontoMelhorado.isFechandoPeriodo}
                    className="flex-1 gap-2"
                  >
                    {pontoMelhorado.isFechandoPeriodo ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Unlock className="w-4 h-4" />
                    )}
                    Reabrir Período
                  </Button>
                )}
              </div>
            </div>

            {/* Histórico */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Histórico de Períodos</h4>
              {loadingPeriodos ? (
                <div className="text-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                </div>
              ) : periodosArray && periodosArray.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {periodosArray.map((periodo) => (
                    <div
                      key={periodo.id}
                      className="flex items-center justify-between p-2 rounded bg-muted/20"
                    >
                      <span className="text-sm capitalize">
                        {formatCompetencia(periodo.competencia)}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            periodo.status === 'aberto' && "border-success/50 text-success",
                            periodo.status === 'fechado' && "border-warning/50 text-warning",
                            periodo.status === 'processado' && "border-info/50 text-info"
                          )}
                        >
                          {periodo.status}
                        </Badge>
                        {periodo.fechado_em && (
                          <span className="text-xs text-muted-foreground">
                            {format(parseISO(periodo.fechado_em), 'dd/MM/yy HH:mm')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum período registrado
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {acaoPendente?.tipo === 'fechar' && 'Fechar Período?'}
              {acaoPendente?.tipo === 'reabrir' && 'Reabrir Período?'}
              {acaoPendente?.tipo === 'exportar' && 'Exportar para Folha?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {acaoPendente?.tipo === 'fechar' && (
                <>
                  Ao fechar o período <strong className="capitalize">{formatCompetencia(acaoPendente.competencia)}</strong>, 
                  não será mais possível editar os registros de ponto. Deseja continuar?
                </>
              )}
              {acaoPendente?.tipo === 'reabrir' && (
                <>
                  Isso permitirá edições nos registros do período <strong className="capitalize">{formatCompetencia(acaoPendente.competencia)}</strong>. 
                  Deseja continuar?
                </>
              )}
              {acaoPendente?.tipo === 'exportar' && (
                <>
                  Os dados de ponto de <strong className="capitalize">{formatCompetencia(acaoPendente.competencia)}</strong> serão 
                  enviados para a folha de pagamento (horas extras, faltas, atrasos). Deseja continuar?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmar}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});