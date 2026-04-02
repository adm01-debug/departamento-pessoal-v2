import { PageTitle } from '@/components/PageTitle';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { FileText, Search, Info, DollarSign, Users, TrendingDown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { gerarPDFHolerite } from '@/utils/holeritePDF';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AnimatedNumber } from '@/components/dashboard/AnimatedNumber';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(value);
}

const componenteInfo: Record<string, string> = {
  'Salário Base': 'Valor fixo mensal conforme contrato de trabalho, proporcional aos dias trabalhados.',
  'Proventos': 'Soma de salário base, horas extras (50%/100%), gratificações, adicional noturno e outros rendimentos.',
  'Descontos': 'INSS (7,5-14%), IRRF (tabela progressiva), Vale Transporte (6%), plano de saúde e outros.',
  'Líquido': 'Valor final = Total Proventos - Total Descontos. É o que o colaborador recebe.',
};

export default function HoleritesPage() {
  const [busca, setBusca] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['holerites'],
    queryFn: async () => {
      const { data, error } = await supabase.from('holerites').select('*').order('created_at', { ascending: false }).limit(200);
      if (error) throw error;
      return data || [];
    },
  });

  const filtered = data?.filter(h =>
    h.colaborador_nome?.toLowerCase().includes(busca.toLowerCase()) ||
    h.colaborador_cpf?.includes(busca)
  ) || [];

  // Summary
  const totais = filtered.reduce(
    (acc, h) => ({
      proventos: acc.proventos + (h.total_proventos || 0),
      descontos: acc.descontos + (h.total_descontos || 0),
      liquido: acc.liquido + (h.liquido || 0),
    }),
    { proventos: 0, descontos: 0, liquido: 0 }
  );

  return (
    <>
    <PageTitle title="Holerites" description="Consulta e emissão de holerites" />
    <PageLayout
      title="Holerites"
      description="Demonstrativos de pagamento dos colaboradores"
      icon={<FileText className="h-5 w-5 text-primary-foreground" />}
      gradient="from-primary to-primary-glow"
    >
      {/* Summary KPIs */}
      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Proventos', value: totais.proventos, color: 'text-success', gradient: 'from-success to-success/70' },
            { label: 'Total Descontos', value: totais.descontos, color: 'text-destructive', gradient: 'from-destructive to-destructive/70' },
            { label: 'Total Líquido', value: totais.liquido, color: 'text-foreground', gradient: 'from-primary to-primary-glow' },
          ].map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="border border-border/30 rounded-2xl overflow-hidden">
                <div className={cn("h-[2px] bg-gradient-to-r", kpi.gradient)} />
                <CardContent className="p-4 text-center">
                  <p className={cn("text-lg font-display font-bold", kpi.color)}>
                    <AnimatedNumber value={kpi.value} format={formatCurrency} />
                  </p>
                  <p className="text-[11px] text-muted-foreground font-body">{kpi.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou CPF..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="pl-10 rounded-xl"
          aria-label="Buscar colaborador por nome ou CPF"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8"><Spinner /></div>
      ) : !filtered.length ? (
        <Card className="border border-border/30 rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-2xl bg-muted/50 mb-3">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="font-display font-semibold">Nenhum holerite encontrado</p>
            <p className="text-caption text-muted-foreground font-body mt-1">Processe uma folha para gerar holerites</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hidden md:block">
            <Card className="border border-border/30 rounded-2xl overflow-hidden shadow-elevated">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-display font-semibold">Colaborador</TableHead>
                      <TableHead className="font-display font-semibold">CPF</TableHead>
                      <TableHead className="font-display font-semibold">Cargo</TableHead>
                      <TableHead className="font-display font-semibold text-right">
                        <TooltipProvider><Tooltip><TooltipTrigger className="inline-flex items-center gap-1">
                          Salário Base <Info className="h-3 w-3 text-muted-foreground/50" />
                        </TooltipTrigger><TooltipContent className="max-w-[200px] text-xs">{componenteInfo['Salário Base']}</TooltipContent></Tooltip></TooltipProvider>
                      </TableHead>
                      <TableHead className="font-display font-semibold text-right">
                        <TooltipProvider><Tooltip><TooltipTrigger className="inline-flex items-center gap-1">
                          Proventos <Info className="h-3 w-3 text-muted-foreground/50" />
                        </TooltipTrigger><TooltipContent className="max-w-[200px] text-xs">{componenteInfo['Proventos']}</TooltipContent></Tooltip></TooltipProvider>
                      </TableHead>
                      <TableHead className="font-display font-semibold text-right">
                        <TooltipProvider><Tooltip><TooltipTrigger className="inline-flex items-center gap-1">
                          Descontos <Info className="h-3 w-3 text-muted-foreground/50" />
                        </TooltipTrigger><TooltipContent className="max-w-[200px] text-xs">{componenteInfo['Descontos']}</TooltipContent></Tooltip></TooltipProvider>
                      </TableHead>
                      <TableHead className="font-display font-semibold text-right">
                        <TooltipProvider><Tooltip><TooltipTrigger className="inline-flex items-center gap-1">
                          Líquido <Info className="h-3 w-3 text-muted-foreground/50" />
                        </TooltipTrigger><TooltipContent className="max-w-[200px] text-xs">{componenteInfo['Líquido']}</TooltipContent></Tooltip></TooltipProvider>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(r => (
                      <TableRow key={r.id} className="hover:bg-accent/30 transition-colors">
                        <TableCell className="font-body font-semibold">{r.colaborador_nome}</TableCell>
                        <TableCell className="text-muted-foreground font-body tabular-nums">{r.colaborador_cpf}</TableCell>
                        <TableCell className="text-muted-foreground font-body">{r.colaborador_cargo}</TableCell>
                        <TableCell className="text-right font-body tabular-nums">{formatCurrency(r.salario_base || 0)}</TableCell>
                        <TableCell className="text-right text-success font-body font-semibold tabular-nums">{formatCurrency(r.total_proventos || 0)}</TableCell>
                        <TableCell className="text-right text-destructive font-body font-semibold tabular-nums">{formatCurrency(r.total_descontos || 0)}</TableCell>
                        <TableCell className="text-right font-display font-bold tabular-nums">{formatCurrency(r.liquido || 0)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="border border-border/30 rounded-2xl overflow-hidden">
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <p className="font-display font-bold truncate">{r.colaborador_nome}</p>
                      <p className="text-caption text-muted-foreground font-body">{r.colaborador_cargo} · {r.colaborador_cpf}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-border/20">
                      <div>
                        <p className="text-[10px] text-muted-foreground font-body uppercase">Proventos</p>
                        <p className="text-caption font-display font-bold text-success">{formatCurrency(r.total_proventos || 0)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-body uppercase">Descontos</p>
                        <p className="text-caption font-display font-bold text-destructive">{formatCurrency(r.total_descontos || 0)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-body uppercase">Líquido</p>
                        <p className="text-caption font-display font-bold">{formatCurrency(r.liquido || 0)}</p>
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
