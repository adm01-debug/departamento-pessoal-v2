import { SEOHead } from '@/components/SEOHead';
import { useState, memo, useEffect, useMemo } from 'react';
import { Plus, UserMinus, FileText, Calculator, CheckCircle, Loader2, DollarSign, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useDesligamentos, Desligamento, TipoDesligamento } from '@/hooks/useDesligamentos';
import { useColaboradores } from '@/hooks/useColaboradores';
import { DesligamentoModal } from '@/components/desligamento/DesligamentoModal';
import { DesligamentoChecklist } from '@/components/desligamento/DesligamentoChecklist';
import { toast } from 'sonner';

const DesligamentoPage = memo(function DesligamentoPage() {
  useEffect(() => {
    document.title = 'Desligamentos | DP System';
  }, []);

  const { 
    desligamentos, 
    loading, 
    createDesligamento, 
    updateDesligamento,
    updateChecklist,
    concluirDesligamento,
    calcularRescisao,
    tipoLabels 
  } = useDesligamentos();
  const { colaboradores } = useColaboradores();
  
  const [novoDesligamentoOpen, setNovoDesligamentoOpen] = useState(false);
  const [selectedDesligamento, setSelectedDesligamento] = useState<Desligamento | null>(null);
  const [tab, setTab] = useState<'em_andamento' | 'concluido'>('em_andamento');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(value);
  };

  // KPIs
  const kpis = useMemo(() => {
    const emAndamento = desligamentos.filter(d => d.status === 'em_andamento');
    const concluidos = desligamentos.filter(d => d.status === 'concluido');
    const totalPago = concluidos.reduce((sum, d) => sum + (d.valor_liquido ?? 0), 0);
    
    return {
      emAndamento: emAndamento.length,
      concluidos: concluidos.length,
      totalPago,
      proximos: emAndamento.filter(d => {
        const dataDeslig = new Date(d.data_desligamento);
        const hoje = new Date();
        const diff = (dataDeslig.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24);
        return diff <= 7 && diff >= 0;
      }).length,
    };
  }, [desligamentos]);

  // Desligamentos filtrados por tab
  const desligamentosFiltrados = desligamentos.filter(d => 
    tab === 'em_andamento' ? d.status === 'em_andamento' : d.status === 'concluido'
  );

  const getColaboradorInfo = (colaboradorId: string) => {
    return colaboradores.find(c => c.id === colaboradorId);
  };

  const handleNovoDesligamento = async (data: unknown) => {
    const colaborador = colaboradores.find(c => c.id === data.colaboradorId);
    if (!colaborador) return;

    const calculo = calcularRescisao(
      colaborador.salario_base,
      new Date(colaborador.data_admissao),
      data.dataDesligamento,
      data.tipoDesligamento,
      data.avisoPrevioTrabalhado
    );

    await createDesligamento({
      colaborador_id: data.colaboradorId,
      tipo: data.tipoDesligamento,
      data_desligamento: data.dataDesligamento.toISOString().split('T')[0],
      data_aviso: data.dataAvisoPrevio?.toISOString().split('T')[0],
      motivo: data.motivoDetalhado,
      salario_base: colaborador.salario_base,
      saldo_salario: calculo.saldoSalario,
      aviso_previo: calculo.avisoPrevio,
      ferias_vencidas: calculo.feriasVencidas,
      ferias_proporcionais: calculo.feriasProporcionais,
      terco_constitucional: calculo.tercoConstitucional,
      decimo_terceiro: calculo.decimoTerceiro,
      multa_fgts: calculo.multaFgts,
      total_proventos: calculo.totalProventos,
      total_descontos: calculo.totalDescontos,
      valor_liquido: calculo.valorLiquido,
    });
  };

  const handleChecklistChange = async (field: string, value: boolean) => {
    if (!selectedDesligamento) return;
    await updateChecklist(selectedDesligamento.id, field, value);
    setSelectedDesligamento(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleConcluir = async () => {
    if (!selectedDesligamento) return;
    await concluirDesligamento(selectedDesligamento.id);
    setSelectedDesligamento(null);
  };

  if (loading) {
    return (
      <>
        <SEOHead title="Desligamento" description="Processo de desligamento" />
        <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
      </>    );
  }

  return (
      <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Desligamento</h1>
          <p className="text-muted-foreground text-sm">Processos de rescisão contratual</p>
        </div>
        <Button className="gap-2" onClick={() => setNovoDesligamentoOpen(true)}>
          <Plus className="w-4 h-4" />
          Novo Desligamento
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{kpis.emAndamento}</p>
                <p className="text-xs text-muted-foreground">Em Andamento</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{kpis.concluidos}</p>
                <p className="text-xs text-muted-foreground">Concluídos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(kpis.totalPago)}</p>
                <p className="text-xs text-muted-foreground">Total Pago</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/20">
                <Users className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{kpis.proximos}</p>
                <p className="text-xs text-muted-foreground">Próximos 7 dias</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs e Lista */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as unknown)}>
        <TabsList>
          <TabsTrigger value="em_andamento" className="gap-2">
            <Clock className="w-4 h-4" />
            Em Andamento ({desligamentos.filter(d => d.status === 'em_andamento').length})
          </TabsTrigger>
          <TabsTrigger value="concluido" className="gap-2">
            <CheckCircle className="w-4 h-4" />
            Concluídos ({desligamentos.filter(d => d.status === 'concluido').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {desligamentosFiltrados.length === 0 ? (
            <div className="p-8 rounded-lg border bg-muted/20 text-center">
              <UserMinus className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum desligamento</h3>
              <p className="text-muted-foreground text-sm">
                {tab === 'em_andamento' 
                  ? 'Não há processos de desligamento em andamento' 
                  : 'Nenhum desligamento concluído'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {desligamentosFiltrados.map((deslig) => {
                const colaborador = getColaboradorInfo(deslig.colaborador_id);
                return (
                  <Card 
                    key={deslig.id} 
                    className={cn(
                      "cursor-pointer hover:border-primary/50 transition-colors",
                      selectedDesligamento?.id === deslig.id && "border-primary"
                    )}
                    onClick={() => setSelectedDesligamento(deslig)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                            <UserMinus className="w-5 h-5 text-destructive" />
                          </div>
                          <div>
                            <h3 className="font-medium">{colaborador?.nome_completo || 'Colaborador'}</h3>
                            <p className="text-sm text-muted-foreground">
                              {colaborador?.cargo} • {colaborador?.departamento}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <Badge variant={deslig.status === 'concluido' ? 'default' : 'secondary'}>
                              {tipoLabels[deslig.tipo]}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(deslig.data_desligamento).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-success">{formatCurrency(deslig.valor_liquido)}</p>
                            <p className="text-xs text-muted-foreground">Valor Líquido</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Detalhes do Desligamento Selecionado */}
      {selectedDesligamento && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Cálculo da Rescisão */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calculator className="w-4 h-4" />
                Cálculo da Rescisão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase font-semibold">Verbas Rescisórias (Proventos)</p>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Saldo de Salário</span>
                  <span className="text-foreground">{formatCurrency(selectedDesligamento.saldo_salario)}</span>
                </div>
                {selectedDesligamento.aviso_previo > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Aviso Prévio</span>
                    <span className="text-foreground">{formatCurrency(selectedDesligamento.aviso_previo)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">13º Proporcional</span>
                  <span className="text-foreground">{formatCurrency(selectedDesligamento.decimo_terceiro)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Férias Proporcionais</span>
                  <span className="text-foreground">{formatCurrency(selectedDesligamento.ferias_proporcionais)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">1/3 Constitucional</span>
                  <span className="text-foreground">{formatCurrency(selectedDesligamento.terco_constitucional)}</span>
                </div>
                {selectedDesligamento.multa_fgts > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Multa FGTS</span>
                    <span className="text-foreground">{formatCurrency(selectedDesligamento.multa_fgts)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-semibold border-t border-border pt-2 mt-2">
                  <span>Total Proventos</span>
                  <span className="text-success">{formatCurrency(selectedDesligamento.total_proventos)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase font-semibold">Descontos</p>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Descontos</span>
                  <span className="text-destructive">{formatCurrency(selectedDesligamento.total_descontos)}</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex justify-between text-lg font-bold">
                  <span>VALOR LÍQUIDO</span>
                  <span className="text-success">{formatCurrency(selectedDesligamento.valor_liquido)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checklist */}
          <DesligamentoChecklist
            desligamento={selectedDesligamento}
            onChecklistChange={handleChecklistChange}
            onConcluir={handleConcluir}
          />
        </div>
      )}

      {/* Modal Novo Desligamento */}
      <DesligamentoModal
        open={novoDesligamentoOpen}
        onOpenChange={setNovoDesligamentoOpen}
        onSubmit={handleNovoDesligamento}
      />
    </div>
  
    </>);
}
