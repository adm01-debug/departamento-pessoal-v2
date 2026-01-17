// V18: useColaboradores Hook - Formatado e Documentado
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { colaboradorService } from '@/services';
import { useToast } from '@/hooks/useToast';

export interface Colaborador {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cargo: string;
  cargo_id: string;
  departamento: string;
  departamento_id: string;
  data_admissao: string;
  salario: number;
  status: 'ativo' | 'inativo' | 'ferias' | 'afastado';
  avatar?: string;
  empresa_id: string;
}

export interface ColaboradorFilters {
  status?: string;
  departamento_id?: string;
  search?: string;
  empresa_id?: string;
}

/**
 * Hook para gerenciar colaboradores
 */
export function useColaboradores(filters?: ColaboradorFilters) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query principal
  const query = useQuery<Colaborador[]>({
    queryKey: ['colaboradores', filters],
    queryFn: async () => {
      const data = await colaboradorService.getAll(filters);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Buscar por ID
  const getById = async (id: string): Promise<Colaborador | null> => {
    return colaboradorService.getById(id);
  };

  // Criar colaborador
  const create = useMutation({
    mutationFn: async (colaborador: Partial<Colaborador>) => {
      return colaboradorService.create(colaborador);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colaboradores'] });
      toast({ title: 'Colaborador cadastrado com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro ao cadastrar', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  // Atualizar colaborador
  const update = useMutation({
    mutationFn: async ({ id, ...colaborador }: Partial<Colaborador> & { id: string }) => {
      return colaboradorService.update(id, colaborador);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colaboradores'] });
      toast({ title: 'Colaborador atualizado com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro ao atualizar', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  // Remover colaborador
  const remove = useMutation({
    mutationFn: async (id: string) => {
      return colaboradorService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colaboradores'] });
      toast({ title: 'Colaborador removido!' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro ao remover', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  return {
    // Dados
    colaboradores: query.data || [],
    
    // Estados
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    
    // Métodos
    getById,
    create,
    update,
    remove,
    
    // Refresh
    refetch: query.refetch,
  };
}

export default useColaboradores;
