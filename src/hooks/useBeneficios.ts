// V18: useBeneficios Hook - Formatado e Documentado
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { beneficioService } from '@/services';
import { useToast } from '@/hooks/useToast';

export type TipoBeneficio = 
  | 'vale_transporte' 
  | 'vale_refeicao' 
  | 'vale_alimentacao' 
  | 'plano_saude' 
  | 'plano_odontologico' 
  | 'seguro_vida' 
  | 'outros';

export interface Beneficio {
  id: string;
  empresa_id: string;
  nome: string;
  tipo: TipoBeneficio;
  valor_empresa: number;
  valor_colaborador: number;
  tipo_desconto: 'percentual' | 'fixo' | 'sem_desconto';
  fornecedor?: string;
  ativo: boolean;
  total_colaboradores?: number;
}

export interface BeneficioFilters {
  tipo?: TipoBeneficio;
  ativo?: boolean;
}

/**
 * Hook para gerenciar benefícios
 */
export function useBeneficios(filters?: BeneficioFilters) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query principal
  const query = useQuery<Beneficio[]>({
    queryKey: ['beneficios', filters],
    queryFn: async () => {
      return beneficioService.list(filters);
    },
    staleTime: 5 * 60 * 1000,
  });

  // Criar benefício
  const create = useMutation({
    mutationFn: async (beneficio: Omit<Beneficio, 'id' | 'total_colaboradores'>) => {
      return beneficioService.create(beneficio);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beneficios'] });
      toast({ title: 'Benefício criado com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro ao criar benefício', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  // Atualizar benefício
  const update = useMutation({
    mutationFn: async ({ id, ...beneficio }: Partial<Beneficio> & { id: string }) => {
      return beneficioService.update(id, beneficio);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beneficios'] });
      toast({ title: 'Benefício atualizado!' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro ao atualizar', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  // Remover benefício
  const remove = useMutation({
    mutationFn: async (id: string) => {
      return beneficioService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beneficios'] });
      toast({ title: 'Benefício removido!' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro ao remover', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  // Vincular colaborador
  const vincular = useMutation({
    mutationFn: async ({ beneficioId, colaboradorId }: { beneficioId: string; colaboradorId: string }) => {
      return beneficioService.vincularColaborador(beneficioId, colaboradorId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beneficios'] });
      toast({ title: 'Colaborador vinculado ao benefício!' });
    },
  });

  return {
    // Dados
    beneficios: query.data || [],
    
    // Estados
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    
    // Mutations
    create,
    update,
    remove,
    vincular,
    
    // Refresh
    refetch: query.refetch,
  };
}

export default useBeneficios;
