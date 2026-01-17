// V18: useFerias Hook - Formatado e Documentado
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feriasService } from '@/services';
import { useToast } from './useToast';

export interface SolicitacaoFerias {
  id: string;
  colaborador_id: string;
  colaborador_nome?: string;
  data_inicio: string;
  data_fim: string;
  dias_solicitados: number;
  abono_pecuniario: boolean;
  dias_abono: number;
  adiantamento_13: boolean;
  status: 'pendente' | 'aprovada' | 'recusada' | 'em_gozo' | 'concluida';
  observacoes?: string;
}

export interface FeriasFilters {
  status?: string;
  colaborador_id?: string;
  mes?: string;
}

/**
 * Hook para listar solicitações de férias
 */
export function useFeriasList(filtros?: FeriasFilters) {
  return useQuery<SolicitacaoFerias[]>({
    queryKey: ['ferias', filtros],
    queryFn: async () => {
      return feriasService.listSolicitacoes(filtros?.status);
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para férias de um colaborador
 */
export function useFeriasColaborador(colaboradorId: string) {
  return useQuery<SolicitacaoFerias[]>({
    queryKey: ['ferias-colaborador', colaboradorId],
    queryFn: async () => {
      return feriasService.getByColaborador(colaboradorId);
    },
    enabled: !!colaboradorId,
  });
}

/**
 * Hook para criar solicitação de férias
 */
export function useCreateFerias() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Partial<SolicitacaoFerias>) => {
      return feriasService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ferias'] });
      toast({ title: 'Férias programadas com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro ao programar férias', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });
}

/**
 * Hook para aprovar férias
 */
export function useAprovarFerias() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      return feriasService.aprovar(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ferias'] });
      toast({ title: 'Férias aprovadas!' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro ao aprovar', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });
}

/**
 * Hook para recusar férias
 */
export function useRecusarFerias() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, motivo }: { id: string; motivo: string }) => {
      return feriasService.recusar(id, motivo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ferias'] });
      toast({ title: 'Férias recusadas' });
    },
  });
}

/**
 * Hook para cancelar férias
 */
export function useCancelarFerias() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      return feriasService.cancelar(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ferias'] });
      toast({ title: 'Férias canceladas' });
    },
  });
}

export default useFeriasList;
