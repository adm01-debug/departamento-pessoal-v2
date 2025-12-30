import { SEOHead } from '@/components/SEOHead';
import { useState, memo, useEffect, useCallback } from 'react';
import { 
  Wallet, CheckCircle, Clock, FileText, Plus, Calculator, 
  Users, Banknote, TrendingUp, ChevronRight, Loader2, 
  Eye, Download, Trash2, PlayCircle, Lock, AlertCircle, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { ExportDropdown } from '@/components/ExportDropdown';
import { formatters, ExportColumn } from '@/lib/exportUtils';
import { 
  useFolhasPagamento, 
  useHolerites, 
  useLancamentos,
  useRubricas,
  useEventosVariaveis,
  useCalculoFolha 
} from '@/hooks/useFolhaPagamento';
import { useColaboradores } from '@/hooks/useColaboradores';
import { useIntegracaoPontoFolha, formatarMinutos } from '@/hooks/useIntegracaoPontoFolha';
import { 
  FolhaPagamento, 
  Holerite,
  LancamentoFolha,
  statusFolhaLabels, 
  statusFolhaColors,
  tipoFolhaLabels,
  formatCompetencia,
  formatCompetenciaFull,
  getCompetenciaAtual,
  tipoEventoLabels
} from '@/types/folha';
import { formatCurrency } from '@/lib/calculosTrabalhistas';
import { toast } from '@/hooks/use-toast';

export default memo(function Folha() {
  useEffect(() => {
    document.title = 'Folha de Pagamento | DP System';
  }, []);

  const { folhas, loading, createFolha, updateFolhaStatus, deleteFolha, fetchFolhas } = useFolhasPagamento();
  const { colaboradores } = useColaboradores();
  const { rubricas } = useRubricas();
  const { calcularFolha, calculating } = useCalculoFolha();
  const { exportarParaFolha, isExportando } = useIntegracaoPontoFolha();
  
  const [selectedFolhaId, setSelectedFolhaId] = useState<string | null>(null);
  const [newFolhaOpen, setNewFolhaOpen] = useState(false);
  const [newCompetencia, setNewCompetencia] = useState(getCompetenciaAtual());
  const [holeriteModalOpen, setHoleriteModalOpen] = useState(false);
  const [selectedHolerite, setSelectedHolerite] = useState<Holerite | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventoModalOpen, setEventoModalOpen] = useState(false);
  
  const selectedFolha = folhas.find(f => f.id === selectedFolhaId);
  const { holerites, loading: loadingHolerites, fetchHolerites } = useHolerites(selectedFolhaId ?? '');
  const { eventos, addEvento, removeEvento } = useEventosVariaveis(selectedFolha?.competencia ?? '');
  
  // Auto-select first folha or latest
  useEffect(() => {
    if (!selectedFolhaId && folhas.length > 0) {
      setSelectedFolhaId(folhas[0].id);
    }
  }, [folhas, selectedFolhaId]);

  const handleCreateFolha = async () => {
    try {
      const folha = await createFolha(newCompetencia, 'mensal');
      setSelectedFolhaId(folha.id);
      setNewFolhaOpen(false);
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleCalcular = async () => {
    if (!selectedFolha) return;
    try {
      await calcularFolha(selectedFolha.id, selectedFolha.competencia);
      await fetchFolhas();
      await fetchHolerites();
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleDelete = async () => {
    if (!selectedFolha) return;
    try {
      await deleteFolha(selectedFolha.id);
      setSelectedFolhaId(null);
      setDeleteConfirmOpen(false);
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleFechar = async () => {
    if (!selectedFolha) return;
    try {
      await updateFolhaStatus(selectedFolha.id, 'fechada');
      await fetchFolhas();
      toast({ title: 'Folha fechada!', description: 'A folha não pode mais ser alterada.' });
    } catch (err) {
      // Error handled in hook
    }
  };

  const openHoleriteDetail = (holerite: Holerite) => {
    setSelectedHolerite(holerite);
    setHoleriteModalOpen(true);
  };

  // Generate competencia options (last 12 months + next 2)
  const competenciaOptions = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - 10 + i);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  });

  if (loading) {
    return (
      <>
        <SEOHead title="Folha | DP System" description="Folha de pagamento" />
        <div id="main-content" className="p-6 flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Folha de Pagamento | DP System" description="Sistema de Departamento Pessoal" />
      <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Folha de Pagamento</h1>
          <p className="text-muted-foreground text-sm">Processamento da folha mensal com cálculos automáticos</p>
        </div>
        <div className="flex items-center gap-2">
          {folhas.length > 0 && (
            <Select value={selectedFolhaId ?? ''} onValueChange={setSelectedFolhaId}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Selecione a competência" />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border z-50">
                {folhas.map(folha => (
                  <SelectItem key={folha.id} value={folha.id}>
                    {formatCompetencia(folha.competencia)} - {tipoFolhaLabels[folha.tipo] || folha.tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button aria-label="Ação" onClick={() => setNewFolhaOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Folha
          </Button>
        </div>
      </div>

      {folhas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-card rounded-xl border border-border">
          <Wallet className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma folha encontrada</h3>
          <p className="text-sm text-muted-foreground mb-4">Crie uma nova folha para começar o processamento</p>
          <Button aria-label="Ação" onClick={() => setNewFolhaOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Criar Primeira Folha
          </Button>
        </div>
      ) : selectedFolha && (
        <>
          {/* Status e Info */}
          <div className="flex items-center gap-4">
            <Badge className={cn("px-3 py-1 border-0", statusFolhaColors[selectedFolha.status].bg, statusFolhaColors[selectedFolha.status].text)}>
              {selectedFolha.status === 'aberta' && <Clock className="w-3 h-3 mr-1" />}
              {selectedFolha.status === 'calculada' && <Calculator className="w-3 h-3 mr-1" />}
              {selectedFolha.status === 'fechada' && <Lock className="w-3 h-3 mr-1" />}
              {selectedFolha.status === 'paga' && <CheckCircle className="w-3 h-3 mr-1" />}
              {statusFolhaLabels[selectedFolha.status]}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {selectedFolha.total_colaboradores} colaboradores
            </span>
            {selectedFolha.data_calculo && (
              <span className="text-xs text-muted-foreground">
                Calculado em {new Date(selectedFolha.data_calculo).toLocaleString('pt-BR')}
              </span>
            )}
          </div>

          {/* Resumo Financeiro */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground uppercase">Total Bruto</p>
              </div>
              <p className="text-3xl font-bold text-foreground">{formatCurrency(selectedFolha.total_proventos)}</p>
            </div>
            <div className="p-5 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Banknote className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground uppercase">Descontos</p>
              </div>
              <p className="text-3xl font-bold text-destructive">{formatCurrency(selectedFolha.total_descontos)}</p>
            </div>
            <div className="p-5 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground uppercase">Total Líquido</p>
              </div>
              <p className="text-3xl font-bold text-success">{formatCurrency(selectedFolha.total_liquido)}</p>
            </div>
          </div>

          {/* Encargos */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <p className="text-xs text-muted-foreground uppercase">FGTS (8%)</p>
              <p className="text-xl font-bold text-foreground">{formatCurrency(selectedFolha.total_fgts)}</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <p className="text-xs text-muted-foreground uppercase">INSS Patronal (20%)</p>
              <p className="text-xl font-bold text-foreground">{formatCurrency(selectedFolha.total_inss_patronal)}</p>
            </div>
          </div>

          {/* Tabs: Holerites / Eventos */}
          <Tabs defaultValue="holerites" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="holerites" className="gap-2">
                  <Users className="w-4 h-4" />
                  Holerites ({holerites.length})
                </TabsTrigger>
                <TabsTrigger value="eventos" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Eventos Variáveis ({eventos.length})
                </TabsTrigger>
              </TabsList>
              
              {holerites.length > 0 && (
                <ExportDropdown
                  defaultFilename={`folha_${selectedFolha.competencia}`}
                  options={{
                    title: `Folha de Pagamento - ${formatCompetenciaFull(selectedFolha.competencia)}`,
                    subtitle: `Total: ${holerites.length} colaboradores | Líquido: ${formatCurrency(selectedFolha.total_liquido)}`,
                    columns: [
                      { key: 'colaborador_nome', header: 'Colaborador', width: 30 },
                      { key: 'colaborador_matricula', header: 'Matrícula', width: 12 },
                      { key: 'colaborador_cargo', header: 'Cargo', width: 20 },
                      { key: 'colaborador_departamento', header: 'Departamento', width: 18 },
                      { key: 'salario_base', header: 'Salário Base', width: 15, format: formatters.currency },
                      { key: 'total_proventos', header: 'Proventos', width: 15, format: formatters.currency },
                      { key: 'total_descontos', header: 'Descontos', width: 15, format: formatters.currency },
                      { key: 'liquido', header: 'Líquido', width: 15, format: formatters.currency },
                      { key: 'valor_fgts', header: 'FGTS', width: 12, format: formatters.currency },
                      { key: 'valor_inss', header: 'INSS', width: 12, format: formatters.currency },
                      { key: 'valor_irrf', header: 'IRRF', width: 12, format: formatters.currency },
                    ] as ExportColumn[],
                    data: holerites as unknown as Record<string, unknown>[],
                  }}
                />
              )}
            </div>

            <TabsContent value="holerites">
              {loadingHolerites ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : holerites.length === 0 ? (
                <div className="text-center py-8 bg-card rounded-xl border border-border">
                  <AlertCircle className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Nenhum holerite calculado</p>
                  <p className="text-xs text-muted-foreground mt-1">Clique em "Calcular Folha" para processar</p>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Colaborador</TableHead>
                        <TableHead>Cargo</TableHead>
                        <TableHead className="text-right">Salário Base</TableHead>
                        <TableHead className="text-right">Proventos</TableHead>
                        <TableHead className="text-right">Descontos</TableHead>
                        <TableHead className="text-right">Líquido</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {holerites.map(holerite => (
                        <TableRow 
                          key={holerite.id} 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => openHoleriteDetail(holerite)}
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium">{holerite.colaborador_nome}</p>
                              <p className="text-xs text-muted-foreground">{holerite.colaborador_matricula || '-'}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{holerite.colaborador_cargo}</TableCell>
                          <TableCell className="text-right font-mono">{formatCurrency(holerite.salario_base)}</TableCell>
                          <TableCell className="text-right font-mono text-success">{formatCurrency(holerite.total_proventos)}</TableCell>
                          <TableCell className="text-right font-mono text-destructive">{formatCurrency(holerite.total_descontos)}</TableCell>
                          <TableCell className="text-right font-mono font-semibold">{formatCurrency(holerite.liquido)}</TableCell>
                          <TableCell>
                            <Button aria-label="Ação" variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="eventos">
              <EventosVariaveisTab 
                competencia={selectedFolha.competencia}
                eventos={eventos}
                colaboradores={colaboradores}
                rubricas={rubricas}
                onAdd={addEvento}
                onRemove={removeEvento}
                disabled={selectedFolha.status !== 'aberta'}
              />
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            {selectedFolha.status === 'aberta' && (
              <>
                <Button 
                  onClick={() => exportarParaFolha(selectedFolha.competencia)} 
                  disabled={isExportando}
                  variant="outline"
                  className="gap-2"
                >
                  {isExportando ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  {isExportando ? 'Importando...' : 'Importar Ponto'}
                </Button>
                <Button 
                  onClick={handleCalcular} 
                  disabled={calculating || colaboradores.length === 0}
                  className="gap-2"
                >
                  {calculating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
                  {calculating ? 'Calculando...' : 'Calcular Folha'}
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </Button>
              </>
            )}
            {selectedFolha.status === 'calculada' && (
              <>
                <Button aria-label="Ação" onClick={handleCalcular} variant="outline" disabled={calculating} className="gap-2">
                  {calculating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
                  Recalcular
                </Button>
                <Button aria-label="Ação" onClick={handleFechar} className="gap-2">
                  <Lock className="w-4 h-4" />
                  Fechar Folha
                </Button>
              </>
            )}
            <Button aria-label="Ação" variant="outline" className="gap-2 ml-auto">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>
        </>
      )}

      {/* Modal Nova Folha */}
      <Dialog open={newFolhaOpen} onOpenChange={setNewFolhaOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Nova Folha de Pagamento</DialogTitle>
            <DialogDescription>Selecione a competência para criar uma nova folha</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Competência</Label>
              <Select value={newCompetencia} onValueChange={setNewCompetencia}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50">
                  {competenciaOptions.map(comp => (
                    <SelectItem key={comp} value={comp}>
                      {formatCompetenciaFull(comp)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button aria-label="Ação" variant="outline" onClick={() => setNewFolhaOpen(false)}>Cancelar</Button>
            <Button aria-label="Ação" onClick={handleCreateFolha}>Criar Folha</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Detalhe Holerite */}
      <HoleriteDetailModal 
        holerite={selectedHolerite}
        open={holeriteModalOpen}
        onOpenChange={setHoleriteModalOpen}
      />

      {/* Confirmação Exclusão */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Folha</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a folha de {selectedFolha ? formatCompetenciaFull(selectedFolha.competencia) : ''}? 
              Todos os holerites e lançamentos serão perdidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </>
  );
}

// Componente de Eventos Variáveis
function EventosVariaveisTab({ 
  competencia, 
  eventos, 
  colaboradores, 
  rubricas,
  onAdd, 
  onRemove,
  disabled 
}: {
  competencia: string;
  eventos: unknown[];
  colaboradores: unknown[];
  rubricas: unknown[];
  onAdd: (evento: unknown) => Promise<unknown>;
  onRemove: (id: string) => Promise<void>;
  disabled: boolean;
}) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newEvento, setNewEvento] = useState({
    colaborador_id: '',
    rubrica_id: '',
    referencia: '',
    valor: '',
    observacao: '',
  });

  const rubricasVariaveis = rubricas.filter(r => !r.automatico && r.tipo !== 'informativo');

  const handleAdd = async () => {
    if (!newEvento.colaborador_id || !newEvento.rubrica_id || !newEvento.valor) {
      toast({ title: 'Erro', description: 'Preencha todos os campos obrigatórios', variant: 'destructive' });
      return;
    }

    try {
      await onAdd({
        competencia,
        colaborador_id: newEvento.colaborador_id,
        rubrica_id: newEvento.rubrica_id,
        referencia: newEvento.referencia ? parseFloat(newEvento.referencia) : null,
        valor: parseFloat(newEvento.valor),
        observacao: newEvento.observacao || null,
      });
      setNewEvento({ colaborador_id: '', rubrica_id: '', referencia: '', valor: '', observacao: '' });
      setAddModalOpen(false);
    } catch (err) {}
  };

  return (
      <div className="space-y-4">
      {!disabled && (
        <div className="flex justify-end">
          <Button aria-label="Ação" onClick={() => setAddModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Adicionar Evento
          </Button>
        </div>
      )}

      {eventos.length === 0 ? (
        <div className="text-center py-8 bg-card rounded-xl border border-border">
          <FileText className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Nenhum evento variável lançado</p>
          {!disabled && (
            <p className="text-xs text-muted-foreground mt-1">Adicione horas extras, faltas, comissões, etc.</p>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Ref.</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventos.map(evento => {
                const colab = colaboradores.find(c => c.id === evento.colaborador_id);
                return (
                  <TableRow key={evento.id}>
                    <TableCell className="font-medium">{colab?.nome_completo || 'N/A'}</TableCell>
                    <TableCell>{evento.rubrica?.descricao || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        evento.rubrica?.tipo === 'provento' && 'text-success border-success/50',
                        evento.rubrica?.tipo === 'desconto' && 'text-destructive border-destructive/50'
                      )}>
                        {tipoEventoLabels[evento.rubrica?.tipo as keyof typeof tipoEventoLabels] || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">{evento.referencia || '-'}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(evento.valor)}</TableCell>
                    <TableCell>
                      {!disabled && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive"
                          onClick={() => onRemove(evento.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modal Adicionar Evento */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Adicionar Evento Variável</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Colaborador *</Label>
              <Select value={newEvento.colaborador_id} onValueChange={v => setNewEvento(p => ({ ...p, colaborador_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50 max-h-[200px]">
                  {colaboradores.filter(c => c.status === 'ativo').map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Evento/Rubrica *</Label>
              <Select value={newEvento.rubrica_id} onValueChange={v => setNewEvento(p => ({ ...p, rubrica_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50 max-h-[200px]">
                  {rubricasVariaveis.map(r => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.codigo} - {r.descricao} ({tipoEventoLabels[r.tipo as keyof typeof tipoEventoLabels]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Referência (horas/dias)</Label>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="0" 
                  value={newEvento.referencia}
                  onChange={e => setNewEvento(p => ({ ...p, referencia: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Valor (R$) *</Label>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="0,00" 
                  value={newEvento.valor}
                  onChange={e => setNewEvento(p => ({ ...p, valor: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Observação</Label>
              <Input 
                placeholder="Opcional" 
                value={newEvento.observacao}
                onChange={e => setNewEvento(p => ({ ...p, observacao: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button aria-label="Ação" variant="outline" onClick={() => setAddModalOpen(false)}>Cancelar</Button>
            <Button aria-label="Adicionar" onClick={handleAdd}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
}

// Componente Detalhe do Holerite
function HoleriteDetailModal({ holerite, open, onOpenChange }: { holerite: Holerite | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { lancamentos, loading } = useLancamentos(holerite?.id ?? '');

  if (!holerite) return null;

  const proventos = lancamentos.filter(l => l.tipo === 'provento');
  const descontos = lancamentos.filter(l => l.tipo === 'desconto');
  const informativos = lancamentos.filter(l => l.tipo === 'informativo');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Holerite
          </DialogTitle>
          <DialogDescription>Detalhamento do holerite</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Dados do Colaborador */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Nome</p>
                <p className="font-medium">{holerite.colaborador_nome}</p>
              </div>
              <div>
                <p className="text-muted-foreground">CPF</p>
                <p className="font-mono">{holerite.colaborador_cpf}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Cargo</p>
                <p>{holerite.colaborador_cargo}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Departamento</p>
                <p>{holerite.colaborador_departamento}</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Proventos */}
              <div>
                <h4 className="font-semibold text-sm mb-2 text-success">Proventos</h4>
                <div className="border border-border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Cód.</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right w-24">Ref.</TableHead>
                        <TableHead className="text-right w-28">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {proventos.map(l => (
                        <TableRow key={l.id}>
                          <TableCell className="font-mono text-xs">{l.rubrica_codigo}</TableCell>
                          <TableCell>{l.rubrica_descricao}</TableCell>
                          <TableCell className="text-right font-mono text-sm">{l.referencia?.toFixed(2) || '-'}</TableCell>
                          <TableCell className="text-right font-mono font-medium">{formatCurrency(l.valor)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-success/5">
                        <TableCell colSpan={3} className="text-right font-semibold">Total Proventos</TableCell>
                        <TableCell className="text-right font-mono font-bold text-success">{formatCurrency(holerite.total_proventos)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Descontos */}
              <div>
                <h4 className="font-semibold text-sm mb-2 text-destructive">Descontos</h4>
                <div className="border border-border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Cód.</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right w-24">Ref.</TableHead>
                        <TableHead className="text-right w-28">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {descontos.map(l => (
                        <TableRow key={l.id}>
                          <TableCell className="font-mono text-xs">{l.rubrica_codigo}</TableCell>
                          <TableCell>{l.rubrica_descricao}</TableCell>
                          <TableCell className="text-right font-mono text-sm">{l.referencia?.toFixed(2) || '-'}%</TableCell>
                          <TableCell className="text-right font-mono font-medium">{formatCurrency(l.valor)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-destructive/5">
                        <TableCell colSpan={3} className="text-right font-semibold">Total Descontos</TableCell>
                        <TableCell className="text-right font-mono font-bold text-destructive">{formatCurrency(holerite.total_descontos)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Líquido */}
              <div className="p-4 bg-primary/5 rounded-lg flex items-center justify-between">
                <span className="font-semibold">Valor Líquido a Receber</span>
                <span className="text-2xl font-bold text-primary">{formatCurrency(holerite.liquido)}</span>
              </div>

              {/* Informativos */}
              {informativos.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Bases de Cálculo</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {informativos.map(l => (
                      <div key={l.id} className="flex justify-between p-2 bg-muted/30 rounded text-sm">
                        <span className="text-muted-foreground">{l.rubrica_descricao}</span>
                        <span className="font-mono">{formatCurrency(l.valor)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
