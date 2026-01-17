// V18-BUILD: useCargos Hook - Com contexto de empresa
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cargoService } from '@/services';
import { useToast } from '@/hooks/useToast';
import { useEmpresa } from '@/contexts';

export interface Cargo {
  id: string;
  empresa_id: string;
  nome: string;
  cbo?: string;
  nivel?: string;
  departamento_id?: string;
  departamento_nome?: string;
  salario_base?: number;
  total_colaboradores?: number;
  ativo: boolean;
}

/**
 * Hook para gerenciar cargos
 */
export function useCargos() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { empresaAtual } = useEmpresa();
  const empresaId = empresaAtual?.id;

  const query = useQuery<Cargo[]>({
    queryKey: ['cargos', empresaId],
    queryFn: async () => {
      if (!empresaId) return [];
      return cargoService.getAll(empresaId);
    },
    enabled: !!empresaId,
    staleTime: 5 * 60 * 1000,
  });

  const create = useMutation({
    mutationFn: async (cargo: Omit<Cargo, 'id' | 'total_colaboradores' | 'departamento_nome'>) => {
      return cargoService.create({ ...cargo, empresa_id: empresaId! });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cargos'] });
      toast({ title: 'Cargo criado com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao criar cargo', description: error.message, variant: 'destructive' });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, ...cargo }: Partial<Cargo> & { id: string }) => {
      return cargoService.update(id, cargo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cargos'] });
      toast({ title: 'Cargo atualizado!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      return cargoService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cargos'] });
      toast({ title: 'Cargo removido!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao remover', description: error.message, variant: 'destructive' });
    },
  });

  return {
    cargos: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    create,
    update,
    remove,
    refetch: query.refetch,
  };
}

export default useCargos;
