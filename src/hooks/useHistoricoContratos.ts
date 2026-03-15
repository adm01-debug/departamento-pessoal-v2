import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { historicoContratoService } from '@/services/historicoContratoService';
import { toast } from 'sonner';

export function useHistoricoContratos(colaboradorId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['historico_contratos', colaboradorId],
    queryFn: () => historicoContratoService.listar(colaboradorId),
    enabled: !!colaboradorId,
  });

  const criarMutation = useMutation({
    mutationFn: (data: any) => historicoContratoService.criar({ ...data, colaborador_id: colaboradorId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historico_contratos', colaboradorId] });
      toast.success('Alteração contratual registrada');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => historicoContratoService.excluir(id),
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
