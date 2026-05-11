import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feriasService } from '@/services';
import { useEmpresas } from './useEmpresas';
import { toast } from 'sonner';

export function useFerias(params?: { page?: number; limit?: number; search?: string; status?: string }) {
  const { empresaAtual } = useEmpresas();
  const empresaId = empresaAtual?.id;
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['ferias', empresaId, params],
    queryFn: () => feriasService.listSolicitacoes(empresaId, params),
    enabled: !!empresaId,
    placeholderData: (previousData) => previousData,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => feriasService.criar(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ferias', empresaId] });
      toast.success('Solicitação de férias criada com sucesso');
    },
    onError: (error: any) => toast.error(`Erro ao criar: ${error.message}`),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => feriasService.atualizar(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ferias', empresaId] });
      toast.success('Solicitação de férias atualizada');
    },
    onError: (error: any) => toast.error(`Erro ao atualizar: ${error.message}`),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => feriasService.excluir(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ferias', empresaId] });
      toast.success('Solicitação de férias excluída');
    },
    onError: (error: any) => toast.error(`Erro ao excluir: ${error.message}`),
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
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
