import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { colaboradorService } from '@/services';
import { useEmpresas } from './useEmpresas';
import { toast } from 'sonner';

export function useColaboradores() {
  const { selectedEmpresa } = useEmpresas();
  const queryClient = useQueryClient();
  const empresaId = selectedEmpresa?.id;

  const query = useQuery({
    queryKey: ['colaboradores', empresaId],
    queryFn: () => colaboradorService.list(empresaId),
    enabled: !!empresaId,
  });

  const criarMutation = useMutation({
    mutationFn: (data: any) => colaboradorService.criar({ ...data, empresa_id: empresaId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colaboradores'] });
      toast.success('Colaborador criado com sucesso');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => colaboradorService.atualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colaboradores'] });
      toast.success('Colaborador atualizado');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => colaboradorService.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colaboradores'] });
      toast.success('Colaborador excluído');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    colaboradores: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    criar: criarMutation.mutateAsync,
    atualizar: atualizarMutation.mutateAsync,
    excluir: excluirMutation.mutateAsync,
    refetch: query.refetch,
  };
}
