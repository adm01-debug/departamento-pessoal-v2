import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyList } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { feriasService } from '@/services';
import { useEmpresas } from '@/hooks/useEmpresas';
import { Check, X, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function FeriasPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const qc = useQueryClient();
  const { empresaAtual } = useEmpresas();

  const { data: solicitacoes, isLoading } = useQuery({
    queryKey: ['ferias-solicitacoes', empresaAtual?.id],
    queryFn: () => feriasService.listSolicitacoes(empresaAtual?.id),
    enabled: !!empresaAtual?.id,
  });

  const aprovarMutation = useMutation({
    mutationFn: (id: string) => feriasService.aprovar(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ferias-solicitacoes'] }); toast.success('Férias aprovadas'); },
  });

  const rejeitarMutation = useMutation({
    mutationFn: (id: string) => feriasService.rejeitar(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ferias-solicitacoes'] }); toast.success('Férias rejeitadas'); },
  });

  const statusOptions = [
    { value: 'pendente', label: 'Pendente' },
    { value: 'aprovada', label: 'Aprovada' },
    { value: 'rejeitada', label: 'Rejeitada' },
  ];

  const filtered = solicitacoes?.filter((s: Record<string, unknown>) =>
    !statusFilter || s.status === statusFilter
  );

  return (
    <PageLayout
      title="Férias"
      description="Gestão de férias dos colaboradores"
      icon={<Calendar className="h-5 w-5 text-white" />}
      gradient="from-warning to-coins"
    >
      <DataTableToolbar
        filters={[{ key: 'status', label: 'Status', options: statusOptions, value: statusFilter, onChange: setStatusFilter }]}
      />

      {isLoading ? (
        <div className="flex justify-center p-8"><Spinner size="lg" /></div>
      ) : !filtered?.length ? (
        <EmptyList entityName="solicitação de férias" />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border/30 overflow-hidden shadow-elevated">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-display font-semibold">Colaborador</TableHead>
                <TableHead className="font-display font-semibold">Período</TableHead>
                <TableHead className="font-display font-semibold">Dias</TableHead>
                <TableHead className="font-display font-semibold">Status</TableHead>
                <TableHead className="w-[100px] font-display font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s: Record<string, any>) => (
                <TableRow key={s.id} className="hover:bg-accent/30 transition-colors">
                  <TableCell className="font-body font-medium">{s.colaborador?.nome_completo || '-'}</TableCell>
                  <TableCell className="font-body">
                    {format(new Date(s.data_inicio), 'dd/MM/yyyy')} - {format(new Date(s.data_fim), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="font-body">{s.dias_gozo || '-'} dias</TableCell>
                  <TableCell><StatusBadge status={s.status} /></TableCell>
                  <TableCell>
                    {s.status === 'pendente' && (
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-success/10 text-success" onClick={() => aprovarMutation.mutate(s.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-destructive/10 text-destructive" onClick={() => rejeitarMutation.mutate(s.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
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
