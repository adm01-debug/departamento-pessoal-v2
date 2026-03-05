// @ts-nocheck
// V18-BUILD: useCargos Hook - Com contexto de empresa
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useToast } from './useToast';
import { useEmpresa } from './useEmpresa';

export interface Cargo {
  id: string;
  nome: string;
  cbo: string;
  nivel: string;
  departamentoId: string;
  salarioBase: number;
  ativo: boolean;
}

/**
 * Hook para buscar todos os cargos da empresa.
 * @returns {UseQueryResult<Cargo[]>}
 */
export function useCargos() {
  const { empresa } = useEmpresa();
  return useQuery<Cargo[]>(
    ['cargos', empresa?.id],
    async () => {
      const r = await api.get('/cargos', { params: { empresaId: empresa?.id } });
      return r.data;
    },
    {
      enabled: !!empresa?.id,
    }
  );
}

/**
 * Hook para buscar um cargo específico por ID.
 * @param {string} id ID do cargo a ser buscado.
 * @returns {UseQueryResult<Cargo>}
 */
export function useCargo(id: string) {
  return useQuery<Cargo>(
    ['cargo', id],
    async () => {
      const r = await api.get(`/cargos/${id}`);
      return r.data;
    },
    {
      enabled: !!id,
    }
  );
}

/**
 * Hook para criar um novo cargo.
 * @returns {UseMutationResult<Cargo, Error, Partial<Cargo>>}
 */
export function useCreateCargo() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Partial<Cargo>) => {
      const r = await api.post('/cargos', data);
      return r.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cargos'] });
      toast({ title: 'Cargo criado com sucesso' });
    },
  });
}

/**
 * Hook para atualizar um cargo existente.
 * @returns {UseMutationResult<Cargo, Error, { id: string; data: Partial<Cargo> }>}
 */
export function useUpdateCargo() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Cargo> }) => {
      const r = await api.put(`/cargos/${id}`, data);
      return r.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cargos'] });
      toast({ title: 'Cargo atualizado' });
    },
  });
}

/**
 * Hook para excluir um cargo.
 * @returns {UseMutationResult<void, Error, string>}
 */
export function useDeleteCargo() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/cargos/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cargos'] });
      toast({ title: 'Cargo removido' });
    },
  });
}
