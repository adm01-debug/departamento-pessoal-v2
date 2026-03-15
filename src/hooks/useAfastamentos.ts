import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { afastamentoService } from '@/services/afastamentoService';
import { useEmpresas } from './useEmpresas';
import { toast } from 'sonner';

export function useAfastamentos() {
  const { selectedEmpresa } = useEmpresas();
  const queryClient = useQueryClient();
  const empresaId = selectedEmpresa?.id;

  const query = useQuery({
    queryKey: ['afastamentos', empresaId],
    queryFn: () => afastamentoService.listar(empresaId),
    enabled: !!empresaId,
  });

  const criarMutation = useMutation({
    mutationFn: (data: any) => afastamentoService.criar({ ...data, empresa_id: empresaId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['afastamentos'] });
      toast.success('Afastamento registrado');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => afastamentoService.atualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['afastamentos'] });
      toast.success('Afastamento atualizado');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => afastamentoService.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['afastamentos'] });
      toast.success('Afastamento excluído');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    afastamentos: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    criar: criarMutation.mutateAsync,
    atualizar: atualizarMutation.mutateAsync,
    excluir: excluirMutation.mutateAsync,
    refetch: query.refetch,
  };
}
