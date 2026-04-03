import { PageTitle } from '@/components/PageTitle';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { EmptyList } from '@/components/ui/empty-state';
import { TableSkeleton } from '@/components/ui/module-skeleton';
import { FeriasKPIs, FeriasTable } from '@/components/ferias';
import { feriasService } from '@/services';
import { useEmpresas } from '@/hooks/useEmpresas';
import { useAuth } from '@/contexts';
import { Calendar, Calculator, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { edgeFunctionsService } from '@/services/edgeFunctionsService';

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
  const qc = useQueryClient();
  const { empresaAtual } = useEmpresas();
  const { user } = useAuth();

  const { data: solicitacoes, isLoading } = useQuery({
    queryKey: ['ferias-solicitacoes', empresaAtual?.id],
    queryFn: () => feriasService.listSolicitacoes(empresaAtual?.id),
    enabled: !!empresaAtual?.id,
  });

  const mutationOpts = (msg: string) => ({
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ferias-solicitacoes'] }); toast.success(msg); },
  });

  const aprovarGestor = useMutation({ mutationFn: (id: string) => feriasService.aprovarGestor(id, user?.id), ...mutationOpts('Aprovado pelo gestor') });
  const aprovarRH = useMutation({ mutationFn: (id: string) => feriasService.aprovarRH(id, user?.id), ...mutationOpts('Aprovado pelo RH') });
  const enviarContabilidade = useMutation({ mutationFn: (id: string) => feriasService.enviarContabilidade(id, user?.id), ...mutationOpts('Enviado à contabilidade') });
  const rejeitarMutation = useMutation({ mutationFn: (id: string) => feriasService.rejeitar(id), ...mutationOpts('Férias rejeitadas') });
  const cancelarMutation = useMutation({ mutationFn: (id: string) => feriasService.cancelar(id, user?.id), ...mutationOpts('Férias canceladas') });

  const filtered = solicitacoes?.filter((s: Record<string, any>) => {
    if (statusFilter && statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (search) {
      const nome = (s.colaborador?.nome_completo || '').toLowerCase();
      if (!nome.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const stats = {
    total: solicitacoes?.length || 0,
    pendentes: solicitacoes?.filter((s: any) => s.status === 'pendente').length || 0,
    aprovadas: solicitacoes?.filter((s: any) => s.status === 'aprovada' || s.aprovado_rh).length || 0,
    emGozo: solicitacoes?.filter((s: any) => s.status === 'em_gozo').length || 0,
    abonoPecuniario: solicitacoes?.filter((s: any) => s.abono_pecuniario).length || 0,
    vencidas: solicitacoes?.filter((s: any) => s.status === 'vencida').length || 0,
  };

  return (
    <>
    <PageTitle title="Férias" description="Gestão de férias dos colaboradores" />
    <PageLayout
      title="Férias"
      description="Gestão de férias com workflow de aprovação em 3 níveis"
      icon={<Calendar className="h-5 w-5 text-primary-foreground" />}
      gradient="from-primary-glow to-primary"
    >
      <FeriasKPIs stats={stats} />

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
          onAprovarGestor={(id) => aprovarGestor.mutate(id)}
          onAprovarRH={(id) => aprovarRH.mutate(id)}
          onEnviarContabilidade={(id) => enviarContabilidade.mutate(id)}
          onRejeitar={(id) => rejeitarMutation.mutate(id)}
          onCancelar={(id) => cancelarMutation.mutate(id)}
        />
      )}
    </PageLayout>
    </>
  );
}
