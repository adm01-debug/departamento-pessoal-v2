// V18-BUILD: useDepartamentos Hook - Usando departamentoService
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { departamentoService } from '@/services';
import { useToast } from '@/hooks/useToast';

export interface Departamento {
  id: string;
  empresa_id: string;
  nome: string;
  codigo?: string;
  gestor_id?: string;
  gestor_nome?: string;
  centro_custo?: string;
  total_colaboradores?: number;
  ativo: boolean;
}

/**
 * Hook para gerenciar departamentos
 */
export function useDepartamentos() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery<Departamento[]>({
    queryKey: ['departamentos'],
    queryFn: async () => {
      return departamentoService.getAll();
    },
    staleTime: 5 * 60 * 1000,
  });

  const create = useMutation({
    mutationFn: async (departamento: Omit<Departamento, 'id' | 'total_colaboradores' | 'gestor_nome'>) => {
      return departamentoService.create(departamento);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departamentos'] });
      toast({ title: 'Departamento criado com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao criar departamento', description: error.message, variant: 'destructive' });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, ...departamento }: Partial<Departamento> & { id: string }) => {
      return departamentoService.update(id, departamento);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departamentos'] });
      toast({ title: 'Departamento atualizado!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      return departamentoService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departamentos'] });
      toast({ title: 'Departamento removido!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao remover', description: error.message, variant: 'destructive' });
    },
  });

  return {
    departamentos: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    create,
    update,
    remove,
    refetch: query.refetch,
  };
}

export default useDepartamentos;
