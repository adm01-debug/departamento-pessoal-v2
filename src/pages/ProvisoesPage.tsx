import { PageTitle } from '@/components/PageTitle';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyList, EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { provisaoService } from '@/services';
import { Calculator, Wallet, TrendingUp, Landmark, PieChart, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AnimatedNumber } from '@/components/dashboard/AnimatedNumber';
import { useEmpresas } from '@/hooks/useEmpresas';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export default function ProvisoesPage() {
  const [competencia, setCompetencia] = useState(new Date().toISOString().substring(0, 7));
  const { empresaAtual } = useEmpresas();
  const queryClient = useQueryClient();

  const { data: provisoes, isLoading } = useQuery({
    queryKey: ['provisoes', empresaAtual?.id, competencia],
    queryFn: () => provisaoService.list(empresaAtual?.id, `${competencia}-01`),
    enabled: !!empresaAtual?.id,
  });

  const mutation = useMutation({
    mutationFn: () => provisaoService.calcular(empresaAtual!.id, `${competencia}-01`),
    onSuccess: (data) => {
      toast.success(data.message || 'Provisões calculadas com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['provisoes'] });
    },
    onError: (error: any) => {
      toast.error('Erro ao calcular provisões: ' + error.message);
    }
  });

  const handleCalcular = () => {
    if (!empresaAtual?.id) {
      toast.error('Selecione uma empresa primeiro.');
      return;
    }
    mutation.mutate();
  };

  const totals = (provisoes || []).reduce(
    (acc, p) => ({
      principal: acc.principal + Number(p.valor_principal || 0),
      inss: acc.inss + Number(p.encargos_inss || 0),
      fgts: acc.fgts + Number(p.encargos_fgts || 0),
      total: acc.total + Number(p.total || 0),
    }),
    { principal: 0, inss: 0, fgts: 0, total: 0 }
  );

  return (
    <>
      <PageTitle title="Provisões Mensais" description="Gestão de provisões de férias e 13º salário" />
      <PageLayout
        title="Provisões Mensais"
        description="Acompanhamento de provisões de férias, 13º e encargos"
        icon={<Wallet className="h-5 w-5 text-primary-foreground" />}
        gradient="from-primary-glow to-primary"
        actions={
          <Button 
            onClick={handleCalcular} 
            disabled={mutation.isPending}
            className="rounded-xl bg-gradient-to-r from-primary-glow to-primary hover:opacity-90 shadow-lg font-body gap-1.5"
          >
            {mutation.isPending ? <Spinner size="sm" className="text-primary-foreground" /> : <Calculator className="h-4 w-4" />}
            Calcular Provisões
          </Button>
        }
      >
        {!isLoading && provisoes && provisoes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Provisionado', value: totals.total, icon: Wallet, gradient: 'from-primary to-primary-glow' },
              { label: 'Valor Principal', value: totals.principal, icon: TrendingUp, gradient: 'from-success to-success/70' },
              { label: 'Encargos INSS', value: totals.inss, icon: Landmark, gradient: 'from-blue-500 to-blue-400' },
              { label: 'Encargos FGTS', value: totals.fgts, icon: PieChart, gradient: 'from-amber-500 to-amber-400' },
            ].map((kpi, i) => (
              <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="border border-border/30 rounded-2xl overflow-hidden">
                  <div className={cn("h-[2px] bg-gradient-to-r", kpi.gradient)} />
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={cn("p-1.5 rounded-lg bg-gradient-to-br", kpi.gradient)}>
                        <kpi.icon className="h-3 w-3 text-primary-foreground" />
                      </div>
                    </div>
                    <p className="text-xl font-display font-bold">
                      <AnimatedNumber value={kpi.value} format={formatCurrency} />
                    </p>
                    <p className="text-xs text-muted-foreground font-body">{kpi.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-muted/20 p-4 rounded-2xl border border-border/30">
          <div className="flex items-center gap-3">
            <span className="text-sm font-body font-medium text-muted-foreground whitespace-nowrap">Referência:</span>
            <input 
              type="month" 
              value={competencia} 
              onChange={(e) => setCompetencia(e.target.value)}
              className="bg-background border border-border/40 rounded-lg px-3 py-1.5 text-sm font-body focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/30">
                  <Info className="h-3.5 w-3.5" />
                  <span>Cálculos baseados em 1/12 por mês</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>O provisionamento de férias inclui 1/3 constitucional. Encargos estimados: INSS Patronal (27,8%) e FGTS (8%).</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12"><Spinner size="lg" /></div>
        ) : !provisoes?.length ? (
          <EmptyState 
            icon={Wallet}
            title="Nenhuma provisão encontrada"
            description="Não há provisões calculadas para esta competência e empresa."
            action={{ label: 'Calcular Provisões', onClick: handleCalcular }} 
          />

        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="rounded-2xl border border-border/30 overflow-hidden shadow-elevated bg-card"
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-display font-semibold">Colaborador</TableHead>
                  <TableHead className="font-display font-semibold">Tipo</TableHead>
                  <TableHead className="font-display font-semibold text-right">Valor Principal</TableHead>
                  <TableHead className="font-display font-semibold text-right">INSS (27.8%)</TableHead>
                  <TableHead className="font-display font-semibold text-right">FGTS (8%)</TableHead>
                  <TableHead className="font-display font-semibold text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {provisoes.map((p) => (
                  <TableRow key={p.id} className="hover:bg-accent/30 transition-colors group">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-body font-semibold">{(p.colaborador as any)?.nome_completo || 'N/A'}</span>
                        <span className="text-[10px] text-muted-foreground uppercase">Salário: {formatCurrency((p.colaborador as any)?.salario_base || 0)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize font-body text-muted-foreground">
                      {p.tipo === 'ferias' ? 'Férias + 1/3' : '13º Salário'}
                    </TableCell>
                    <TableCell className="text-right font-body tabular-nums">{formatCurrency(p.valor_principal)}</TableCell>
                    <TableCell className="text-right font-body text-muted-foreground tabular-nums">{formatCurrency(p.encargos_inss)}</TableCell>
                    <TableCell className="text-right font-body text-muted-foreground tabular-nums">{formatCurrency(p.encargos_fgts)}</TableCell>
                    <TableCell className="text-right font-display font-bold tabular-nums text-primary">{formatCurrency(p.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </PageLayout>
    </>
  );
}
