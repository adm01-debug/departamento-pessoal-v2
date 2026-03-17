import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FolhaStatus } from '@/components/ui/status-badge';
import { EmptyList } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { folhaService } from '@/services';
import { Eye, Calculator, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function FolhaPage() {
  const [competencia, setCompetencia] = useState('');
  const navigate = useNavigate();

  const { data: folhas, isLoading } = useQuery({
    queryKey: ['folhas', competencia],
    queryFn: () => folhaService.list(competencia || undefined),
  });

  const formatCurrency = (value: number | null) => (value ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <PageLayout
      title="Folha de Pagamento"
      description="Gestão de folhas de pagamento"
      icon={<FileText className="h-5 w-5 text-primary-foreground" />}
      gradient="from-primary-glow to-primary"
      actions={
        <Button onClick={() => navigate('/folha/calcular')} className="rounded-xl bg-gradient-to-r from-primary-glow to-primary hover:opacity-90 shadow-lg font-body">
          <Calculator className="h-4 w-4 mr-2" />Calcular Folha
        </Button>
      }
    >
      <DataTableToolbar search={competencia} onSearchChange={setCompetencia} searchPlaceholder="Competência (AAAA-MM)" />

      {isLoading ? (
        <div className="flex justify-center p-8"><Spinner size="lg" /></div>
      ) : !folhas?.length ? (
        <EmptyList entityName="folha" onCreate={() => navigate('/folha/calcular')} />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border/30 overflow-hidden shadow-elevated">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-display font-semibold">Competência</TableHead>
                <TableHead className="font-display font-semibold">Tipo</TableHead>
                <TableHead className="font-display font-semibold">Total Proventos</TableHead>
                <TableHead className="font-display font-semibold">Total Descontos</TableHead>
                <TableHead className="font-display font-semibold">Total Líquido</TableHead>
                <TableHead className="font-display font-semibold">Status</TableHead>
                <TableHead className="w-[80px] font-display font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {folhas.map((f) => (
                <TableRow key={f.id} className="hover:bg-accent/30 transition-colors">
                  <TableCell className="font-body font-medium">{f.competencia}</TableCell>
                  <TableCell className="capitalize font-body">{(f.tipo || '').replace('_', ' ')}</TableCell>
                  <TableCell className="text-success font-body font-semibold">{formatCurrency(f.total_proventos)}</TableCell>
                  <TableCell className="text-destructive font-body font-semibold">{formatCurrency(f.total_descontos)}</TableCell>
                  <TableCell className="font-display font-bold">{formatCurrency(f.total_liquido)}</TableCell>
                  <TableCell><FolhaStatus status={f.status} /></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-finance/10" onClick={() => navigate('/folha/calcular')}><Eye className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      )}
    </PageLayout>
  );
}
