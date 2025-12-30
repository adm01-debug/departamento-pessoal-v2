import { SEOHead } from '@/components/SEOHead';
import { useState, memo, useEffect, useEffect, useCallback } from 'react';
import { Gift, Plus, Loader2, Search, X, Pencil, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { useBeneficios, TipoBeneficio } from '@/hooks/useBeneficios';
import { useColaboradores } from '@/hooks/useColaboradores';
import { ExportDropdown } from '@/components/ExportDropdown';
import { formatters, ExportColumn } from '@/lib/exportUtils';
import { cn } from '@/lib/utils';

const Beneficios = memo(function Beneficios() {
  useEffect(() => {
    document.title = 'Benefícios | DP System';
  }, []);

  const { 
    tiposBeneficio, 
    beneficiosColaboradores, 
    loadingBeneficios, 
    adicionarBeneficio, 
    removerBeneficio,
    calcularResumo,
    isAdding 
  } = useBeneficios();
  
  const { colaboradores } = useColaboradores();
  const colaboradoresAtivos = colaboradores?.filter(c => c.status === 'ativo') ?? [];

  const [modalOpen, setModalOpen] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [busca, setBusca] = useState('');
  
  // Form state
  const [colaboradorId, setColaboradorId] = useState('');
  const [tipoBeneficioId, setTipoBeneficioId] = useState('');
  const [valor, setValor] = useState('');
  const [desconto, setDesconto] = useState('');

  const resumo = calcularResumo();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Agrupar benefícios por colaborador
  const beneficiosPorColaborador = colaboradoresAtivos.map(colab => {
    const beneficios = beneficiosColaboradores.filter(b => b.colaborador_id === colab.id);
    const totalBeneficios = beneficios.reduce((acc, b) => acc + Number(b.valor), 0);
    const totalDescontos = beneficios.reduce((acc, b) => acc + Number(b.desconto ?? 0), 0);
    
    return {
      colaborador: colab,
      beneficios,
      totalBeneficios,
      totalDescontos,
    };
  }).filter(item => {
    // Filtrar por busca
    if (busca) {
      const termo = busca.toLowerCase();
      if (!item.colaborador.nome_completo.toLowerCase().includes(termo)) {
        return false;
      }
    }
    // Filtrar por tipo
    if (filtroTipo !== 'todos') {
      if (!item.beneficios.some(b => b.tipo_beneficio_id === filtroTipo)) {
        return false;
      }
    }
    return true;
  });

  const handleAdicionarBeneficio = () => {
    if (!colaboradorId || !tipoBeneficioId || !valor) return;

    const tipo = tiposBeneficio.find(t => t.id === tipoBeneficioId);
    const valorNum = parseFloat(valor);
    const descontoNum = desconto ? parseFloat(desconto) : (tipo?.desconto_colaborador ? valorNum * (tipo.desconto_colaborador / 100) : 0);

    adicionarBeneficio({
      colaborador_id: colaboradorId,
      tipo_beneficio_id: tipoBeneficioId,
      valor: valorNum,
      desconto: descontoNum,
    });

    setModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setColaboradorId('');
    setTipoBeneficioId('');
    setValor('');
    setDesconto('');
  };

  const handleTipoChange = (tipoId: string) => {
    setTipoBeneficioId(tipoId);
    const tipo = tiposBeneficio.find(t => t.id === tipoId);
    if (tipo) {
      setValor(tipo.valor_padrao.toString());
    }
  };

  // Dados para exportação
  const dadosExport = beneficiosColaboradores.map(b => ({
    colaborador: b.colaborador?.nome_completo ?? '',
    departamento: b.colaborador?.departamento ?? '',
    beneficio: b.tipo_beneficio?.nome ?? '',
    valor: b.valor,
    desconto: b.desconto ?? 0,
    data_inicio: b.data_inicio,
  }));

  if (loadingBeneficios) {
    return (
      <>
        <SEOHead title="Benefícios | DP System" description="Gestão de benefícios" />
        <div id="main-content" className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Carregando benefícios...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Benefícios</h1>
          <p className="text-muted-foreground text-sm">Gestão de vale-transporte, refeição, saúde e outros</p>
        </div>
        <div className="flex gap-2">
          <ExportDropdown
            defaultFilename="beneficios"
            options={{
              title: 'Relatório de Benefícios',
              subtitle: `Total: ${beneficiosColaboradores.length} benefícios ativos`,
              columns: [
                { key: 'colaborador', header: 'Colaborador', width: 25 },
                { key: 'departamento', header: 'Departamento', width: 20 },
                { key: 'beneficio', header: 'Benefício', width: 20 },
                { key: 'valor', header: 'Valor', width: 15, format: formatters.currency },
                { key: 'desconto', header: 'Desconto', width: 15, format: formatters.currency },
                { key: 'data_inicio', header: 'Início', width: 12, format: formatters.date },
              ] as ExportColumn[],
              data: dadosExport as unknown as Record<string, unknown>[],
            }}
          />
          <Button className="gap-2" onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Adicionar Benefício
          </Button>
        </div>
      </div>

      {/* Resumo Cards */}
      <div className="p-5 rounded-xl bg-card border border-border">
        <h3 className="font-semibold text-sm text-foreground mb-4">Resumo Mensal</h3>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {resumo.porTipo.slice(0, 4).map((item) => (
            <div key={item.tipo.id} className="p-4 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{item.tipo.icone}</span>
                <span className="font-semibold text-sm text-foreground">{item.tipo.codigo}</span>
              </div>
              <p className="text-xl font-bold text-foreground">{formatCurrency(item.valorTotal)}</p>
              <p className="text-xs text-muted-foreground">{item.quantidade} colab.</p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-sm text-muted-foreground">Total Mensal</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(resumo.totalMensal)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Desconto Colaboradores</p>
            <p className="text-xl font-bold text-success">{formatCurrency(resumo.totalDescontos)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Custo Empresa</p>
            <p className="text-xl font-bold text-foreground">{formatCurrency(resumo.custoEmpresa)}</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar colaborador..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filtroTipo} onValueChange={setFiltroTipo}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo de benefício" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tipos</SelectItem>
            {tiposBeneficio.map(tipo => (
              <SelectItem key={tipo.id} value={tipo.id}>
                {tipo.icone} {tipo.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(busca || filtroTipo !== 'todos') && (
          <Button aria-label="Ação" variant="ghost" size="sm" onClick={() => { setBusca(''); setFiltroTipo('todos'); }}>
            <X className="w-4 h-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      {/* Por Colaborador */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground">Benefícios por Colaborador</h3>
          <Badge variant="outline">{beneficiosPorColaborador.length} colaboradores</Badge>
        </div>
        
        {beneficiosPorColaborador.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Nenhum benefício cadastrado
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <table className="w-full">
              <thead className="bg-muted/30 sticky top-0">
                <tr>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground">Colaborador</th>
                  {tiposBeneficio.slice(0, 5).map(tipo => (
                    <th key={tipo.id} className="text-center p-4 text-xs font-semibold text-muted-foreground">
                      {tipo.icone} {tipo.codigo}
                    </th>
                  ))}
                  <th className="text-center p-4 text-xs font-semibold text-muted-foreground">Total</th>
                  <th className="text-center p-4 text-xs font-semibold text-muted-foreground">Desconto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {beneficiosPorColaborador.map((item) => (
                  <tr key={item.colaborador.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-medium text-foreground">{item.colaborador.nome_completo}</p>
                      <p className="text-xs text-muted-foreground">{item.colaborador.departamento}</p>
                    </td>
                    {tiposBeneficio.slice(0, 5).map(tipo => {
                      const beneficio = item.beneficios.find(b => b.tipo_beneficio_id === tipo.id);
                      return (
                        <td key={tipo.id} className="p-4 text-sm text-center">
                          {beneficio ? (
                            <Badge className="bg-success/10 text-success border-0">
                              {formatCurrency(beneficio.valor)}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-4 text-sm text-center font-semibold text-foreground">
                      {formatCurrency(item.totalBeneficios)}
                    </td>
                    <td className="p-4 text-sm text-center text-destructive">
                      {item.totalDescontos > 0 ? formatCurrency(item.totalDescontos) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        )}
      </div>

      {/* Modal Adicionar Benefício */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Benefício</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Colaborador</Label>
              <Select value={colaboradorId} onValueChange={setColaboradorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o colaborador" />
                </SelectTrigger>
                <SelectContent>
                  {colaboradoresAtivos.map(colab => (
                    <SelectItem key={colab.id} value={colab.id}>
                      {colab.nome_completo} - {colab.departamento}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Benefício</Label>
              <Select value={tipoBeneficioId} onValueChange={handleTipoChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o benefício" />
                </SelectTrigger>
                <SelectContent>
                  {tiposBeneficio.map(tipo => (
                    <SelectItem key={tipo.id} value={tipo.id}>
                      {tipo.icone} {tipo.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="0,00"
                />
              </div>
              <div className="space-y-2">
                <Label>Desconto (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={desconto}
                  onChange={(e) => setDesconto(e.target.value)}
                  placeholder="0,00"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button aria-label="Ação" variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button aria-label="Ação" onClick={handleAdicionarBeneficio} disabled={isAdding || !colaboradorId || !tipoBeneficioId}>
              {isAdding && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
