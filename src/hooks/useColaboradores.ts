import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { colaboradorService } from '@/services';
import { useEmpresas } from './useEmpresas';
import { toast } from 'sonner';

export function useColaboradores() {
  const { empresaAtual } = useEmpresas();
  const queryClient = useQueryClient();
  const empresaId = empresaAtual?.id;

  const query = useQuery({
    queryKey: ['colaboradores', empresaId],
    queryFn: async () => {
      const res = await colaboradorService.list(empresaId);
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
    },
    enabled: !!empresaId,
  });

  const criarMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await colaboradorService.criar({ ...data, empresa_id: empresaId });
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colaboradores'] });
      toast.success('Colaborador criado com sucesso');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const atualizarMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await colaboradorService.atualizar(id, data);
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colaboradores'] });
      toast.success('Colaborador atualizado');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const excluirMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await colaboradorService.excluir(id);
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
    },
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

