import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { historicoContratoService } from '@/services/historicoContratoService';
import { toast } from 'sonner';

export function useHistoricoContratos(colaboradorId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['historico_contratos', colaboradorId],
    queryFn: async () => {
      const res = await historicoContratoService.listar(colaboradorId);
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
    },
    enabled: !!colaboradorId,
  });

  const criarMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await historicoContratoService.criar({ ...data, colaborador_id: colaboradorId });
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historico_contratos', colaboradorId] });
      toast.success('Alteração contratual registrada');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const excluirMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await historicoContratoService.excluir(id);
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historico_contratos', colaboradorId] });
      toast.success('Registro excluído');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    historico: query.data || [],
    isLoading: query.isLoading,
    criar: criarMutation.mutateAsync,
    excluir: excluirMutation.mutateAsync,
  };
}

