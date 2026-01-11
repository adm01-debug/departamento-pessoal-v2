// V16-025: useFerias Hook - Production Ready
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feriasServiceReal, FeriasFilters } from '@/services/feriasService.real';
import type { Insertable, Updatable } from '@/integrations/supabase/database.types';
import { toast } from 'sonner';

export const FERIAS_KEY = 'ferias';

export function useFerias(filters: FeriasFilters = {}) {
  return useQuery({
    queryKey: [FERIAS_KEY, filters],
    queryFn: () => feriasServiceReal.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeriasById(id: string | undefined) {
  return useQuery({
    queryKey: [FERIAS_KEY, id],
    queryFn: () => id ? feriasServiceReal.getById(id) : null,
    enabled: !!id,
  });
}

export function useFeriasByColaborador(colaboradorId: string | undefined) {
  return useQuery({
    queryKey: [FERIAS_KEY, 'colaborador', colaboradorId],
    queryFn: () => colaboradorId ? feriasServiceReal.getByColaborador(colaboradorId) : [],
    enabled: !!colaboradorId,
  });
}

export function useFeriasVencendo(empresaId: string, dias: number = 60) {
  return useQuery({
    queryKey: [FERIAS_KEY, 'vencendo', empresaId, dias],
    queryFn: () => feriasServiceReal.getVencendo(empresaId, dias),
    enabled: !!empresaId,
  });
}

export function useCreateFerias() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Insertable<'ferias'>) => feriasServiceReal.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FERIAS_KEY] });
      toast.success('Férias cadastradas com sucesso!');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useProgramarFerias() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, inicio, dias, abono }: { id: string; inicio: string; dias: number; abono?: number }) => feriasServiceReal.programar(id, inicio, dias, abono),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FERIAS_KEY] });
      toast.success('Férias programadas com sucesso!');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useConcluirFerias() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => feriasServiceReal.concluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FERIAS_KEY] });
      toast.success('Férias concluídas!');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
