// V16-024: useColaboradores Hook - Production Ready
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { colaboradorServiceReal, ColaboradorFilters, ColaboradorWithRelations } from '@/services/colaboradorService.real';
import type { Insertable, Updatable } from '@/integrations/supabase/database.types';
import { toast } from 'sonner';

export const COLABORADORES_KEY = 'colaboradores';

export function useColaboradores(filters: ColaboradorFilters = {}) {
  return useQuery({
    queryKey: [COLABORADORES_KEY, filters],
    queryFn: () => colaboradorServiceReal.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useColaborador(id: string | undefined) {
  return useQuery({
    queryKey: [COLABORADORES_KEY, id],
    queryFn: () => id ? colaboradorServiceReal.getById(id) : null,
    enabled: !!id,
  });
}

export function useCreateColaborador() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Insertable<'colaboradores'>) => colaboradorServiceReal.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COLABORADORES_KEY] });
      toast.success('Colaborador cadastrado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao cadastrar colaborador');
    },
  });
}

export function useUpdateColaborador() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Updatable<'colaboradores'> }) => colaboradorServiceReal.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [COLABORADORES_KEY] });
      queryClient.invalidateQueries({ queryKey: [COLABORADORES_KEY, id] });
      toast.success('Colaborador atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar colaborador');
    },
  });
}

export function useDeleteColaborador() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => colaboradorServiceReal.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COLABORADORES_KEY] });
      toast.success('Colaborador removido com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover colaborador');
    },
  });
}

export function useColaboradoresAtivos(empresaId: string) {
  return useQuery({
    queryKey: [COLABORADORES_KEY, 'ativos', empresaId],
    queryFn: () => colaboradorServiceReal.getAtivos(empresaId),
    enabled: !!empresaId,
  });
}

export function useAniversariantes(empresaId: string, mes: number) {
  return useQuery({
    queryKey: [COLABORADORES_KEY, 'aniversariantes', empresaId, mes],
    queryFn: () => colaboradorServiceReal.getAniversariantes(empresaId, mes),
    enabled: !!empresaId,
  });
}
