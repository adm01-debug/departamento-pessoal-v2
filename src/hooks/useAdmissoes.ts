import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { admissaoService } from '@/services';
import { useEmpresas } from './useEmpresas';
import { toast } from 'sonner';

export function useAdmissoes() {
  const { selectedEmpresa } = useEmpresas();
  const queryClient = useQueryClient();
  const empresaId = selectedEmpresa?.id;

  const query = useQuery({
    queryKey: ['admissoes', empresaId],
    queryFn: () => admissaoService.listar(empresaId),
    enabled: !!empresaId,
  });

  const criarMutation = useMutation({
    mutationFn: (data: any) => admissaoService.criar({ ...data, empresa_id: empresaId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissoes'] });
      toast.success('Admissão criada com sucesso');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => admissaoService.atualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissoes'] });
      toast.success('Admissão atualizada');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    admissoes: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    criar: criarMutation.mutateAsync,
    atualizar: atualizarMutation.mutateAsync,
    refetch: query.refetch,
  };
}
