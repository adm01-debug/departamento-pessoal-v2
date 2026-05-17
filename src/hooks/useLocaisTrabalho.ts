import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localTrabalhoService } from '@/services/localTrabalhoService';
import { useEmpresas } from './useEmpresas';
import { toast } from 'sonner';

export function useLocaisTrabalho() {
  const { empresaAtual } = useEmpresas();
  const queryClient = useQueryClient();
  const empresaId = empresaAtual?.id;

  const query = useQuery({
    queryKey: ['locais_trabalho', empresaId],
    queryFn: () => localTrabalhoService.listar(empresaId),
    enabled: true,
  });

  const criarMutation = useMutation({
    mutationFn: (data: any) => localTrabalhoService.criar({ ...data, empresa_id: empresaId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locais_trabalho'] });
      toast.success('Local de trabalho criado');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => localTrabalhoService.atualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locais_trabalho'] });
      toast.success('Local de trabalho atualizado');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => localTrabalhoService.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locais_trabalho'] });
      toast.success('Local de trabalho excluído');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    locais: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    criar: criarMutation.mutateAsync,
    atualizar: atualizarMutation.mutateAsync,
    excluir: excluirMutation.mutateAsync,
    refetch: query.refetch,
  };
}
