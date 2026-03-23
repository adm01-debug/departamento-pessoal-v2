import { PageTitle } from '@/components/PageTitle';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { FolhaStatus } from '@/components/ui/status-badge';
import { EmptyList } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { folhaService } from '@/services';
import { Eye, Calculator, FileText, DollarSign, TrendingUp, TrendingDown, Banknote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AnimatedNumber } from '@/components/dashboard/AnimatedNumber';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(value);
}

export default function FolhaPage() {
  const [competencia, setCompetencia] = useState('');
  const navigate = useNavigate();

  const { data: folhas, isLoading } = useQuery({
    queryKey: ['folhas', competencia],
    queryFn: () => folhaService.list(competencia || undefined),
  });

  // Summary KPIs from loaded data
  const totais = (folhas || []).reduce(
    (acc, f) => ({
      proventos: acc.proventos + (f.total_proventos || 0),
      descontos: acc.descontos + (f.total_descontos || 0),
      liquido: acc.liquido + (f.total_liquido || 0),
      count: acc.count + 1,
    }),
    { proventos: 0, descontos: 0, liquido: 0, count: 0 }
  );

  return (
    <>
    <PageTitle title="Folha de Pagamento" description="Gestão de folha de pagamento" />
    <PageLayout
      title="Folha de Pagamento"
      description="Gestão e histórico de folhas processadas"
      icon={<Banknote className="h-5 w-5 text-primary-foreground" />}
      gradient="from-primary-glow to-primary"
      actions={
        <Button onClick={() => navigate('/folha/calcular')} className="rounded-xl bg-gradient-to-r from-primary-glow to-primary hover:opacity-90 shadow-lg font-body gap-1.5">
          <Calculator className="h-4 w-4" />Processar Folha
        </Button>
      }
    >
      {/* Summary Cards */}
      {!isLoading && folhas && folhas.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Folhas Processadas', value: totais.count, icon: FileText, gradient: 'from-primary to-primary-glow', isCurrency: false },
            { label: 'Total Proventos', value: totais.proventos, icon: TrendingUp, gradient: 'from-success to-success/70', isCurrency: true },
            { label: 'Total Descontos', value: totais.descontos, icon: TrendingDown, gradient: 'from-destructive to-destructive/70', isCurrency: true },
            { label: 'Total Líquido', value: totais.liquido, icon: DollarSign, gradient: 'from-primary-glow to-primary', isCurrency: true },
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
                  <p className="text-lg font-display font-bold">
                    {kpi.isCurrency ? (
                      <AnimatedNumber value={kpi.value} format={formatCurrency} />
                    ) : (
                      <AnimatedNumber value={kpi.value} />
                    )}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-body">{kpi.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <DataTableToolbar search={competencia} onSearchChange={setCompetencia} searchPlaceholder="Filtrar por competência (AAAA-MM)" />

      {isLoading ? (
        <div className="flex justify-center p-8"><Spinner size="lg" /></div>
      ) : !folhas?.length ? (
        <EmptyList entityName="folha" onCreate={() => navigate('/folha/calcular')} />
      ) : (
        <>
          {/* Desktop Table */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hidden md:block rounded-2xl border border-border/30 overflow-hidden shadow-elevated">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-display font-semibold">Competência</TableHead>
                  <TableHead className="font-display font-semibold">Tipo</TableHead>
                  <TableHead className="font-display font-semibold text-right">Proventos</TableHead>
                  <TableHead className="font-display font-semibold text-right">Descontos</TableHead>
                  <TableHead className="font-display font-semibold text-right">Líquido</TableHead>
                  <TableHead className="font-display font-semibold">Status</TableHead>
                  <TableHead className="w-[60px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {folhas.map((f) => (
                  <TableRow key={f.id} className="hover:bg-accent/30 transition-colors group">
                    <TableCell className="font-body font-semibold">{f.competencia}</TableCell>
                    <TableCell className="capitalize font-body text-muted-foreground">{(f.tipo || '').replace('_', ' ')}</TableCell>
                    <TableCell className="text-right text-success font-body font-semibold tabular-nums">{formatCurrency(f.total_proventos || 0)}</TableCell>
                    <TableCell className="text-right text-destructive font-body font-semibold tabular-nums">{formatCurrency(f.total_descontos || 0)}</TableCell>
                    <TableCell className="text-right font-display font-bold tabular-nums">{formatCurrency(f.total_liquido || 0)}</TableCell>
                    <TableCell><FolhaStatus status={f.status} /></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => navigate('/folha/calcular')} aria-label="Visualizar detalhes">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {folhas.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border border-border/30 rounded-2xl overflow-hidden" onClick={() => navigate('/folha/calcular')}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold">{f.competencia}</span>
                      <FolhaStatus status={f.status} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-[10px] text-muted-foreground font-body uppercase">Proventos</p>
                        <p className="text-caption font-display font-bold text-success">{formatCurrency(f.total_proventos || 0)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-body uppercase">Descontos</p>
                        <p className="text-caption font-display font-bold text-destructive">{formatCurrency(f.total_descontos || 0)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-body uppercase">Líquido</p>
                        <p className="text-caption font-display font-bold">{formatCurrency(f.total_liquido || 0)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </PageLayout>
    </>
  );
}
