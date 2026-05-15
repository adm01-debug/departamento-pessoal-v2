import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feriasService } from '@/services';
import { useEmpresas } from './useEmpresas';
import { auditLogger } from '@/utils/auditLogger';
import { toast } from 'sonner';

export function useFerias(params?: { page?: number; limit?: number; search?: string; status?: string }) {
  const { empresaAtual } = useEmpresas();
  const empresaId = empresaAtual?.id;
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['ferias', empresaId, params],
    queryFn: async () => {
      const res = await feriasService.listSolicitacoes(empresaId, params);
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
    },
    enabled: !!empresaId,
    placeholderData: (previousData) => previousData,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await feriasService.criar({ ...data, empresa_id: empresaId });
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['ferias', empresaId] });
      qc.invalidateQueries({ queryKey: ['periodos-aquisitivos'] });
      auditLogger.log({
        tabela: 'ferias',
        registro_id: data.id,
        acao: 'INSERT',
        dados_novos: data
      });
      toast.success('Solicitação de férias criada com sucesso');
    },
    onError: (error: any) => toast.error(`Erro ao criar: ${error.message}`),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await feriasService.atualizar(id, data);
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['ferias', empresaId] });
      qc.invalidateQueries({ queryKey: ['periodos-aquisitivos'] });
      auditLogger.log({
        tabela: 'ferias',
        registro_id: variables.id,
        acao: 'UPDATE',
        dados_novos: variables.data
      });
      toast.success('Solicitação de férias atualizada');
    },
    onError: (error: any) => toast.error(`Erro ao atualizar: ${error.message}`),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await feriasService.excluir(id);
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
    },
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['ferias', empresaId] });
      qc.invalidateQueries({ queryKey: ['periodos-aquisitivos'] });
      auditLogger.log({
        tabela: 'ferias',
        registro_id: id,
        acao: 'DELETE'
      });
      toast.success('Solicitação de férias excluída');
    },
    onError: (error: any) => toast.error(`Erro ao excluir: ${error.message}`),
  });

  const aprovarGestorMutation = useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId?: string }) => {
      const res = await feriasService.aprovarGestor(id, userId);
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ferias', empresaId] });
      toast.success('Férias aprovadas pelo gestor');
    },
    onError: (error: any) => toast.error(`Erro ao aprovar gestor: ${error.message}`),
  });

  const aprovarRHMutation = useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId?: string }) => {
      const res = await feriasService.aprovarRH(id, userId);
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ferias', empresaId] });
      toast.success('Férias aprovadas pelo RH e finalizadas');
    },
    onError: (error: any) => toast.error(`Erro ao aprovar RH: ${error.message}`),
  });

  return {
    ferias: query.data?.data || [],
    totalCount: query.data?.count || 0,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    aprovarGestor: aprovarGestorMutation.mutateAsync,
    aprovarRH: aprovarRHMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

