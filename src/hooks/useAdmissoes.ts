import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { admissaoService } from '@/services';
import { useEmpresas } from './useEmpresas';
import { toast } from 'sonner';

export function useAdmissoes() {
  const { empresaAtual } = useEmpresas();
  const queryClient = useQueryClient();
  const empresaId = empresaAtual?.id;

  const query = useQuery<any[]>({
    queryKey: ['admissoes', empresaId],
    queryFn: () => admissaoService.listarAdmissoes(empresaId),
    // Guard: evita fetch sem tenant (possível vazamento cross-empresa via RLS frouxa).
    enabled: !!empresaId,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['admissoes', empresaId] });

  const criarMutation = useMutation({
    mutationFn: (data: any) => admissaoService.criar({ ...data, empresa_id: empresaId }),
    onSuccess: () => {
      void invalidate();
      toast.success('Admissão criada com sucesso');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => admissaoService.atualizar(id, data),
    onSuccess: () => {
      void invalidate();
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
