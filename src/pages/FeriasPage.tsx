// @ts-nocheck
// V15-226: src/pages/FeriasPage.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyList } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { feriasService } from '@/services';
import { Check, X } from 'lucide-react';
import { format } from 'date-fns';

export default function FeriasPage() {
  const [statusFilter, setStatusFilter] = useState('pendente');

  const { data: solicitacoes, isLoading } = useQuery({
    queryKey: ['ferias-solicitacoes', statusFilter],
    queryFn: () => feriasService.listSolicitacoes(statusFilter || undefined),
  });

  const statusOptions = [
    { value: 'pendente', label: 'Pendente' },
    { value: 'aprovada', label: 'Aprovada' },
    { value: 'recusada', label: 'Recusada' },
  ];

  const statusVariants: Record<string, 'warning' | 'success' | 'error'> = {
    pendente: 'warning', aprovada: 'success', recusada: 'error',
  };

  return (
    <PageLayout title="Férias" description="Gestão de férias dos colaboradores">
      <DataTableToolbar
        filters={[{ key: 'status', label: 'Status', options: statusOptions, value: statusFilter, onChange: setStatusFilter }]}
      />

      {isLoading ? (
        <div className="flex justify-center p-8"><Spinner size="lg" /></div>
      ) : !solicitacoes?.length ? (
        <EmptyList entityName="solicitação de férias" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Colaborador</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Dias</TableHead>
              <TableHead>Abono</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {solicitacoes.map((s: any) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.colaborador?.nome}</TableCell>
                <TableCell>{format(new Date(s.data_inicio), 'dd/MM/yyyy')} - {format(new Date(s.data_fim), 'dd/MM/yyyy')}</TableCell>
                <TableCell>{s.dias_solicitados} dias</TableCell>
                <TableCell>{s.abono_pecuniario ? `${s.dias_abono} dias` : '-'}</TableCell>
                <TableCell><StatusBadge status={s.status} variant={statusVariants[s.status]} /></TableCell>
                <TableCell>
                  {s.status === 'pendente' && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="text-green-600"><Check className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-red-600"><X className="h-4 w-4" /></Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </PageLayout>
  );
}
