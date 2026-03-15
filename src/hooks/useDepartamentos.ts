import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { departamentoService } from '@/services/departamentoService';
import { useEmpresas } from './useEmpresas';
import { toast } from 'sonner';

export function useDepartamentos() {
  const { selectedEmpresa } = useEmpresas();
  const queryClient = useQueryClient();
  const empresaId = selectedEmpresa?.id;

  const query = useQuery({
    queryKey: ['departamentos', empresaId],
    queryFn: () => departamentoService.listar(empresaId),
    enabled: !!empresaId,
  });

  const criarMutation = useMutation({
    mutationFn: (data: any) => departamentoService.criar({ ...data, empresa_id: empresaId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departamentos'] });
      toast.success('Departamento criado');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => departamentoService.atualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departamentos'] });
      toast.success('Departamento atualizado');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => departamentoService.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departamentos'] });
      toast.success('Departamento excluído');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    departamentos: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    criar: criarMutation.mutateAsync,
    atualizar: atualizarMutation.mutateAsync,
    excluir: excluirMutation.mutateAsync,
    refetch: query.refetch,
  };
}
