import { SEOHead } from '@/components/SEOHead';
import { useState, memo, useEffect, useMemo, useCallback } from 'react';
import { Plus, Calendar, List, AlertTriangle, CheckCircle, XCircle, Eye, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { ExportDropdown } from '@/components/ExportDropdown';
import { formatters, ExportColumn } from '@/lib/exportUtils';
import { useColaboradores } from '@/hooks/useColaboradores';
import { useFerias, calcularFerias, calcularDiasDireito } from '@/hooks/useFerias';
import { format, parseISO, addDays, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/calculosTrabalhistas';
import { StatusFerias, CalculoFerias } from '@/types/ferias';

const statusLabels: Record<string, string> = {
  programada: 'Programada',
  aprovada: 'Aprovada',
  em_gozo: 'Em Gozo',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
};

const statusColors: Record<string, { bg: string; text: string }> = {
  programada: { bg: 'bg-warning/10', text: 'text-warning' },
  aprovada: { bg: 'bg-success/10', text: 'text-success' },
  em_gozo: { bg: 'bg-info/10', text: 'text-info' },
  concluida: { bg: 'bg-muted', text: 'text-muted-foreground' },
  cancelada: { bg: 'bg-destructive/10', text: 'text-destructive' },
};

const statusPeriodoLabels: Record<string, string> = {
  em_aquisicao: 'Em Aquisição',
  adquirido: 'Adquirido',
  vencido: 'Vencido',
  gozado: 'Gozado',
  pago: 'Pago',
};

export default memo(function Ferias() {
  useEffect(() => {
    document.title = 'Férias | DP System';
  }, []);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [colaboradorId, setColaboradorId] = useState<string>('');
  const [anoFiltro, setAnoFiltro] = useState(new Date().getFullYear());

  // Form state
  const [formColaboradorId, setFormColaboradorId] = useState<string>('');
  const [formDataInicio, setFormDataInicio] = useState('');
  const [formDiasGozo, setFormDiasGozo] = useState(30);
  const [formVenderAbono, setFormVenderAbono] = useState(false);
  const [formDiasAbono, setFormDiasAbono] = useState(0);
  const [formObservacoes, setFormObservacoes] = useState('');
  const [calculo, setCalculo] = useState<CalculoFerias | null>(null);

  const { colaboradores, loading: loadingColaboradores } = useColaboradores();
  const { 
    useFeriasQuery, 
    usePeriodosAquisitivos,
    programarFerias, 
    aprovarFerias,
    cancelarFerias,
    gerarPeriodosAquisitivos,
    calcularPeriodoConcessivo,
    isProgramando 
  } = useFerias();

  const colaboradoresAtivos = colaboradores?.filter(c => c.status === 'ativo') ?? [];
  const colaboradorSelecionado = colaboradoresAtivos.find(c => c.id === formColaboradorId);

  const { data: ferias, isLoading: loadingFerias } = useFeriasQuery({ ano: anoFiltro });
  const { data: periodosAquisitivos } = usePeriodosAquisitivos(formColaboradorId);

  // Identificar períodos críticos (vencendo em 60 dias)
  const periodosCriticos = useMemo(() => {
    if (!colaboradoresAtivos.length) return [];
    
    const hoje = new Date();
    const criticos: { nome: string; diasRestantes: number }[] = [];
    
    // Simular períodos para cada colaborador
    colaboradoresAtivos.forEach(c => {
      const admissao = parseISO(c.data_admissao);
      const diasDesdeAdmissao = differenceInDays(hoje, admissao);
      const diasNoPerodo = diasDesdeAdmissao % 365;
      const diasParaVencer = 365 - diasNoPerodo;
      
      if (diasParaVencer <= 60 && diasParaVencer > 0) {
        criticos.push({ nome: c.nome_completo, diasRestantes: diasParaVencer });
      }
    });
    
    return criticos.sort((a, b) => a.diasRestantes - b.diasRestantes);
  }, [colaboradoresAtivos]);

  // Calcular valores quando mudar colaborador ou dias
  const handleCalcular = () => {
    if (!colaboradorSelecionado) {
      toast.error('Selecione um colaborador');
      return;
    }

    const diasAbono = formVenderAbono ? Math.min(formDiasAbono, Math.floor(formDiasGozo / 3)) : 0;
    const resultado = calcularFerias(
      colaboradorSelecionado.salario_base,
      formDiasGozo,
      diasAbono,
      0 // dependentes - buscar do colaborador se tiver
    );
    setCalculo(resultado);
  };

  // Programar férias
  const handleProgramar = () => {
    if (!formColaboradorId || !formDataInicio || !calculo) {
      toast.error('Preencha todos os campos e calcule os valores');
      return;
    }

    const dataFim = format(
      addDays(parseISO(formDataInicio), formDiasGozo - 1 + (formVenderAbono ? formDiasAbono : 0)),
      'yyyy-MM-dd'
    );

    programarFerias({
      colaborador_id: formColaboradorId,
      periodo_aquisitivo_id: null,
      data_inicio: formDataInicio,
      data_fim: dataFim,
      dias_gozo: formDiasGozo,
      dias_abono: formVenderAbono ? formDiasAbono : 0,
      vender_abono: formVenderAbono,
      data_pagamento: null,
      salario_base: calculo.salarioBase,
      valor_ferias: calculo.valorFerias,
      valor_terco: calculo.valorTerco,
      valor_abono: calculo.valorAbono,
      valor_terco_abono: calculo.valorTercoAbono,
      valor_total: calculo.valorBruto,
      descontos_inss: calculo.descontoINSS,
      descontos_irrf: calculo.descontoIRRF,
      valor_liquido: calculo.valorLiquido,
      status: 'programada',
      aprovado_por: null,
      aprovado_em: null,
      observacoes: formObservacoes || null,
      created_by: null
    });

    setDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormColaboradorId('');
    setFormDataInicio('');
    setFormDiasGozo(30);
    setFormVenderAbono(false);
    setFormDiasAbono(0);
    setFormObservacoes('');
    setCalculo(null);
  };

  return (
    <>
      <SEOHead title="Férias | DP System" description="Gestão de férias" />
    <div id="main-content" className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Férias</h1>
          <p className="text-muted-foreground text-sm">Gestão de férias e períodos aquisitivos</p>
        </div>
        <div className="flex gap-2">
          <ExportDropdown
            defaultFilename={`ferias_${anoFiltro}`}
            options={{
              title: `Relatório de Férias - ${anoFiltro}`,
              subtitle: `Total: ${ferias?.length ?? 0} registros`,
              columns: [
                { key: 'colaborador_nome', header: 'Colaborador', width: 30 },
                { key: 'data_inicio', header: 'Início', width: 12, format: formatters.date },
                { key: 'data_fim', header: 'Fim', width: 12, format: formatters.date },
                { key: 'dias_gozo', header: 'Dias Gozo', width: 10 },
                { key: 'dias_abono', header: 'Abono', width: 8 },
                { key: 'valor_total', header: 'Valor Bruto', width: 15, format: formatters.currency },
                { key: 'valor_liquido', header: 'Valor Líquido', width: 15, format: formatters.currency },
                { key: 'status', header: 'Status', width: 12 },
              ] as ExportColumn[],
              data: (ferias ?? []).map(f => ({
                ...f,
                colaborador_nome: colaboradoresAtivos.find(c => c.id === f.colaborador_id)?.nome_completo || '-',
              })) as unknown as Record<string, unknown>[],
            }}
            disabled={!ferias || ferias.length === 0}
          />
          <Button className="gap-2" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            Programar Férias
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="gap-2"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
            Lista
          </Button>
          <Button 
            variant={viewMode === 'calendar' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="gap-2"
            onClick={() => setViewMode('calendar')}
          >
            <Calendar className="w-4 h-4" />
            Calendário
          </Button>
        </div>
        <Select value={String(anoFiltro)} onValueChange={v => setAnoFiltro(Number(v))}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[2024, 2025, 2026].map(ano => (
              <SelectItem key={ano} value={String(ano)}>{ano}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Alert: Períodos críticos */}
      {periodosCriticos.length > 0 && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm text-foreground">Períodos Aquisitivos Críticos</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {periodosCriticos.length} colaborador(es) com férias vencendo nos próximos 60 dias
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {periodosCriticos.slice(0, 5).map((p, i) => (
                  <Badge key={i} className={cn(
                    "border-0",
                    p.diasRestantes <= 30 ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"
                  )}>
                    {p.nome} - {p.diasRestantes} dias
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resumo Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase">Programadas</p>
          <p className="text-2xl font-bold text-warning mt-1">
            {ferias?.filter(f => f.status === 'programada').length ?? 0}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase">Aprovadas</p>
          <p className="text-2xl font-bold text-success mt-1">
            {ferias?.filter(f => f.status === 'aprovada').length ?? 0}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase">Em Gozo</p>
          <p className="text-2xl font-bold text-info mt-1">
            {ferias?.filter(f => f.status === 'em_gozo').length ?? 0}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase">Concluídas</p>
          <p className="text-2xl font-bold text-muted-foreground mt-1">
            {ferias?.filter(f => f.status === 'concluida').length ?? 0}
          </p>
        </div>
      </div>

      {/* Férias List */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="font-semibold text-sm text-foreground">Férias Programadas - {anoFiltro}</h3>
        </div>
        
        {loadingFerias ? (
          <div className="p-8 text-center text-muted-foreground">Carregando...</div>
        ) : !ferias?.length ? (
          <div className="p-8 text-center text-muted-foreground">
            Nenhuma férias programada para {anoFiltro}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {ferias.map((f) => {
              const colors = statusColors[f.status] || statusColors.programada;
              return (
                <div key={f.id} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                        <span className="text-sm">🏖️</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">{f.colaborador_nome}</p>
                        <p className="text-xs text-muted-foreground">{f.colaborador_departamento}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          {format(parseISO(f.data_inicio), 'dd/MM/yyyy')} - {format(parseISO(f.data_fim), 'dd/MM/yyyy')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {f.dias_gozo} dias {f.dias_abono > 0 && `+ ${f.dias_abono} abono`}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">{formatCurrency(f.valor_liquido)}</p>
                        <p className="text-xs text-muted-foreground">líquido</p>
                      </div>
                      
                      <Badge className={cn("border-0", colors.bg, colors.text)}>
                        {statusLabels[f.status]}
                      </Badge>
                      
                      <div className="flex gap-1">
                        {f.status === 'programada' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-success"
                              onClick={() => aprovarFerias({ feriasId: f.id, aprovadoPor: '' })}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-destructive"
                              onClick={() => cancelarFerias(f.id)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dialog Programar Férias */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Programar Férias</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Coluna 1 - Dados */}
            <div className="space-y-4">
              <div>
                <Label>Colaborador</Label>
                <Select value={formColaboradorId} onValueChange={setFormColaboradorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o colaborador" />
                  </SelectTrigger>
                  <SelectContent>
                    {colaboradoresAtivos.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {colaboradorSelecionado && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Salário: {formatCurrency(colaboradorSelecionado.salario_base)}
                  </p>
                )}
              </div>
              
              <div>
                <Label>Data de Início</Label>
                <Input 
                  type="date" 
                  value={formDataInicio}
                  onChange={e => setFormDataInicio(e.target.value)}
                />
              </div>
              
              <div>
                <Label>Dias de Gozo</Label>
                <Select value={String(formDiasGozo)} onValueChange={v => setFormDiasGozo(Number(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 dias</SelectItem>
                    <SelectItem value="15">15 dias</SelectItem>
                    <SelectItem value="20">20 dias</SelectItem>
                    <SelectItem value="30">30 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-3">
                <Switch 
                  checked={formVenderAbono}
                  onCheckedChange={setFormVenderAbono}
                />
                <Label>Vender Abono Pecuniário</Label>
              </div>
              
              {formVenderAbono && (
                <div>
                  <Label>Dias de Abono (máx. 1/3)</Label>
                  <Select value={String(formDiasAbono)} onValueChange={v => setFormDiasAbono(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(Math.floor(formDiasGozo / 3) + 1)].map((_, i) => (
                        <SelectItem key={i} value={String(i)}>{i} dias</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <Label>Observações</Label>
                <Textarea
                  value={formObservacoes}
                  onChange={e => setFormObservacoes(e.target.value)}
                  placeholder="Observações opcionais..."
                />
              </div>
              
              <Button aria-label="Ação" variant="outline" className="w-full gap-2" onClick={handleCalcular}>
                <Calculator className="w-4 h-4" />
                Calcular Valores
              </Button>
            </div>
            
            {/* Coluna 2 - Cálculo */}
            <div className="space-y-4">
              {calculo ? (
                <div className="p-4 rounded-xl bg-muted/30 space-y-3">
                  <h4 className="font-semibold text-sm">Demonstrativo de Cálculo</h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Salário Base</span>
                      <span>{formatCurrency(calculo.salarioBase)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Férias ({calculo.diasGozo} dias)</span>
                      <span>{formatCurrency(calculo.valorFerias)}</span>
                    </div>
                    <div className="flex justify-between text-success">
                      <span>1/3 Constitucional</span>
                      <span>{formatCurrency(calculo.valorTerco)}</span>
                    </div>
                    {calculo.diasAbono > 0 && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Abono ({calculo.diasAbono} dias)</span>
                          <span>{formatCurrency(calculo.valorAbono)}</span>
                        </div>
                        <div className="flex justify-between text-success">
                          <span>1/3 s/ Abono</span>
                          <span>{formatCurrency(calculo.valorTercoAbono)}</span>
                        </div>
                      </>
                    )}
                    
                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total Bruto</span>
                        <span>{formatCurrency(calculo.valorBruto)}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-destructive">
                      <span>INSS</span>
                      <span>- {formatCurrency(calculo.descontoINSS)}</span>
                    </div>
                    <div className="flex justify-between text-destructive">
                      <span>IRRF</span>
                      <span>- {formatCurrency(calculo.descontoIRRF)}</span>
                    </div>
                    
                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Valor Líquido</span>
                        <span className="text-success">{formatCurrency(calculo.valorLiquido)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-xl bg-muted/30 text-center text-muted-foreground">
                  Selecione um colaborador e clique em "Calcular Valores" para ver o demonstrativo
                </div>
              )}
              
              <Button 
                className="w-full" 
                onClick={handleProgramar}
                disabled={!calculo || isProgramando}
              >
                {isProgramando ? 'Salvando...' : 'Programar Férias'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
});
