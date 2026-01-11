// V16-026: useFolha Hook - Production Ready
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { folhaServiceReal, FolhaFilters } from '@/services/folhaService.real';
import type { Insertable, Updatable } from '@/integrations/supabase/database.types';
import { toast } from 'sonner';

export const FOLHA_KEY = 'folha';

export function useFolhas(filters: FolhaFilters = {}) {
  return useQuery({
    queryKey: [FOLHA_KEY, filters],
    queryFn: () => folhaServiceReal.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useFolhaById(id: string | undefined) {
  return useQuery({
    queryKey: [FOLHA_KEY, id],
    queryFn: () => id ? folhaServiceReal.getById(id) : null,
    enabled: !!id,
  });
}

export function useFolhaByCompetencia(empresaId: string, competencia: string) {
  return useQuery({
    queryKey: [FOLHA_KEY, 'competencia', empresaId, competencia],
    queryFn: () => folhaServiceReal.getByCompetencia(empresaId, competencia),
    enabled: !!empresaId && !!competencia,
  });
}

export function useCreateFolha() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Insertable<'folha_pagamento'>) => folhaServiceReal.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FOLHA_KEY] });
      toast.success('Folha criada com sucesso!');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useCalcularFolha() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => folhaServiceReal.calcular(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FOLHA_KEY] });
      toast.success('Folha calculada com sucesso!');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useFecharFolha() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => folhaServiceReal.fechar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FOLHA_KEY] });
      toast.success('Folha fechada com sucesso!');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useReabrirFolha() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => folhaServiceReal.reabrir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FOLHA_KEY] });
      toast.success('Folha reaberta!');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
