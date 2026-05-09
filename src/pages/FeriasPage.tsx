import { PageTitle } from '@/components/PageTitle';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { EmptyList } from '@/components/ui/empty-state';
import { TableSkeleton } from '@/components/ui/module-skeleton';
import { FeriasKPIs, FeriasTable } from '@/components/ferias';
import { useFerias } from '@/hooks/useFerias';
import { useFeriasAprovacao } from '@/hooks/useFeriasAprovacao';
import { useEmpresas } from '@/hooks/useEmpresas';
import { Calendar, Calculator, Loader2, List, CalendarDays, History } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { edgeFunctionsService } from '@/services/edgeFunctionsService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarioFerias } from '@/components/ferias/CalendarioFerias';
import { GerenciamentoPeriodos } from '@/components/ferias/GerenciamentoPeriodos';
import { calculoFerias } from '@/utils/calculoFerias';


const statusOptions = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'aprovada', label: 'Aprovada' },
  { value: 'rejeitada', label: 'Rejeitada' },
  { value: 'em_gozo', label: 'Em Gozo' },
  { value: 'concluida', label: 'Concluída' },
  { value: 'cancelada', label: 'Cancelada' },
];

export default function FeriasPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [openCalc, setOpenCalc] = useState(false);
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcForm, setCalcForm] = useState({ salario: '', diasFerias: '30', diasAbono: '0' });
  const [calcResult, setCalcResult] = useState<any>(null);
  
  const { ferias, isLoading } = useFerias();
  const { 
    aprovarGestor, 
    aprovarRH, 
    enviarContabilidade, 
    rejeitar, 
    cancelar 
  } = useFeriasAprovacao();

  const handleCalcFerias = async () => {
    setCalcLoading(true);
    // Instant client-side calculation for better UX
    const instant = calculoFerias.calcular({
      salarioBase: parseFloat(calcForm.salario) || 0,
      diasFerias: parseInt(calcForm.diasFerias) || 30,
      diasAbono: parseInt(calcForm.diasAbono) || 0
    });
    setCalcResult(instant);
    
    try {
      // Refresh with authoritative backend calculation
      const result = await edgeFunctionsService.calcularFerias({
        salario_base: parseFloat(calcForm.salario) || 0,
        dias_ferias: parseInt(calcForm.diasFerias) || 30,
        dias_abono: parseInt(calcForm.diasAbono) || 0,
      });
      setCalcResult(result);
      toast.success('Cálculo validado pelo servidor');
    } catch (err: any) {
      console.error('Erro no cálculo server-side:', err);
    } finally {
      setCalcLoading(false);
    }
  };

  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const filtered = ferias?.filter((s: Record<string, any>) => {
    if (statusFilter && statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (search) {
      const nome = (s.colaborador?.nome_completo || '').toLowerCase();
      if (!nome.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const stats = {
    total: ferias?.length || 0,
    pendentes: ferias?.filter((s: any) => s.status === 'pendente').length || 0,
    aprovadas: ferias?.filter((s: any) => s.status === 'aprovada' || s.aprovado_rh).length || 0,
    emGozo: ferias?.filter((s: any) => s.status === 'em_gozo').length || 0,
    abonoPecuniario: ferias?.filter((s: any) => s.abono_pecuniario).length || 0,
    vencidas: ferias?.filter((s: any) => s.status === 'vencida').length || 0,
  };


  return (
    <>
    <PageTitle title="Férias" description="Gestão de férias dos colaboradores" />
    <PageLayout
      title="Férias"
      description="Gestão de férias com workflow de aprovação em 3 níveis"
      icon={<Calendar className="h-5 w-5 text-primary-foreground" />}
      gradient="from-primary-glow to-primary"
      actions={
        <Dialog open={openCalc} onOpenChange={setOpenCalc}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="rounded-xl gap-1.5 font-body">
              <Calculator className="h-4 w-4" />Simulador
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader><DialogTitle className="flex items-center gap-2 font-display"><Calculator className="h-5 w-5" /> Simulador de Férias</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label className="font-body">Salário Base (R$)</Label><Input type="number" placeholder="5000.00" value={calcForm.salario} onChange={e => setCalcForm(p => ({ ...p, salario: e.target.value }))} className="rounded-xl" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="font-body">Dias de Férias</Label><Input type="number" min="1" max="30" value={calcForm.diasFerias} onChange={e => setCalcForm(p => ({ ...p, diasFerias: e.target.value }))} className="rounded-xl" /></div>
                <div className="space-y-2"><Label className="font-body">Dias Abono</Label><Input type="number" min="0" max="10" value={calcForm.diasAbono} onChange={e => setCalcForm(p => ({ ...p, diasAbono: e.target.value }))} className="rounded-xl" /></div>
              </div>
              <Button onClick={handleCalcFerias} disabled={calcLoading || !calcForm.salario} className="w-full rounded-xl bg-gradient-to-r from-primary-glow to-primary font-body">
                {calcLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Calculator className="h-4 w-4 mr-2" />}Calcular
              </Button>
              {calcResult && (
                <Card className="border border-border/30 rounded-xl">
                  <CardContent className="p-4 space-y-2 text-sm font-body">
                    {calcResult.ferias_brutas != null && <div className="flex justify-between"><span>Férias Brutas:</span><span className="font-bold">{fmt(calcResult.ferias_brutas)}</span></div>}
                    {calcResult.terco_constitucional != null && <div className="flex justify-between"><span>1/3 Constitucional:</span><span className="font-bold">{fmt(calcResult.terco_constitucional)}</span></div>}
                    {calcResult.abono_pecuniario != null && calcResult.abono_pecuniario > 0 && <div className="flex justify-between"><span>Abono Pecuniário:</span><span className="font-bold">{fmt(calcResult.abono_pecuniario)}</span></div>}
                    {calcResult.inss != null && <div className="flex justify-between"><span>INSS:</span><span className="text-destructive">-{fmt(calcResult.inss)}</span></div>}
                    {calcResult.irrf != null && <div className="flex justify-between"><span>IRRF:</span><span className="text-destructive">-{fmt(calcResult.irrf)}</span></div>}
                    {calcResult.liquido != null && <div className="border-t border-border/30 pt-2 flex justify-between text-base font-bold"><span>Líquido:</span><span className="text-primary">{fmt(calcResult.liquido)}</span></div>}
                  </CardContent>
                </Card>
              )}
            </div>
          </DialogContent>
        </Dialog>
      }
    >
      <FeriasKPIs stats={stats} />

      <Tabs defaultValue="solicitacoes" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="solicitacoes" className="rounded-lg gap-2 font-display">
            <List className="h-4 w-4" /> Solicitações
          </TabsTrigger>
          <TabsTrigger value="calendario" className="rounded-lg gap-2 font-display">
            <CalendarDays className="h-4 w-4" /> Calendário
          </TabsTrigger>
          <TabsTrigger value="periodos" className="rounded-lg gap-2 font-display">
            <History className="h-4 w-4" /> Períodos Aquisitivos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="solicitacoes" className="space-y-6">
          <DataTableToolbar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Buscar colaborador..."
            filters={[{ key: 'status', label: 'Status', options: statusOptions, value: statusFilter, onChange: setStatusFilter }]}
            onClearFilters={() => { setStatusFilter(''); setSearch(''); }}
          />

          {isLoading ? (
            <TableSkeleton rows={6} columns={7} />
          ) : !filtered?.length ? (
            <EmptyList entityName="solicitação de férias" />
          ) : (
            <FeriasTable
              data={filtered}
              onAprovarGestor={(id) => aprovarGestor(id)}
              onAprovarRH={(id) => aprovarRH(id)}
              onEnviarContabilidade={(id) => enviarContabilidade(id)}
              onRejeitar={(id) => rejeitar(id)}
              onCancelar={(id) => cancelar(id)}
            />
          )}
        </TabsContent>

        <TabsContent value="calendario">
          <CalendarioFerias />
        </TabsContent>

        <TabsContent value="periodos">
          <div className="grid gap-6">
            {/* Typically we would have a selector for collaborator here, 
                for now we show the most recent ones or a generic list */}
            <p className="text-sm text-muted-foreground font-body">
              Selecione um colaborador na tabela de solicitações para ver seus períodos detalhados ou visualize o resumo geral abaixo.
            </p>
            {/* If we had a selectedColaboradorId state, we would pass it here */}
            {filtered && filtered.length > 0 && (
              <GerenciamentoPeriodos colaboradorId={filtered[0].colaborador_id} />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>

    </>
  );
}
