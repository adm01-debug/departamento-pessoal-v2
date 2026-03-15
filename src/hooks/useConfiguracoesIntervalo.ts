import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { intervaloService } from '@/services/intervaloService';
import { useEmpresas } from './useEmpresas';
import { toast } from 'sonner';

export function useConfiguracoesIntervalo() {
  const { empresaAtual } = useEmpresas();
  const queryClient = useQueryClient();
  const empresaId = empresaAtual?.id;

  const query = useQuery({
    queryKey: ['configuracoes_intervalo', empresaId],
    queryFn: () => intervaloService.listar(empresaId),
    enabled: !!empresaId,
  });

  const criarMutation = useMutation({
    mutationFn: (data: any) => intervaloService.criar({ ...data, empresa_id: empresaId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuracoes_intervalo'] });
      toast.success('Configuração de intervalo criada');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => intervaloService.atualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuracoes_intervalo'] });
      toast.success('Configuração atualizada');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => intervaloService.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuracoes_intervalo'] });
      toast.success('Configuração excluída');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    configuracoes: query.data || [],
    isLoading: query.isLoading,
    criar: criarMutation.mutateAsync,
    atualizar: atualizarMutation.mutateAsync,
    excluir: excluirMutation.mutateAsync,
    refetch: query.refetch,
  };
}
