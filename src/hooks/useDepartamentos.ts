// @ts-nocheck
// V18-BUILD: useDepartamentos Hook - Com contexto de empresa
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useToast } from './useToast';
import { useAuthStore } from '@/stores/authStore';

export interface Departamento {
  id: string;
  nome: string;
  codigo: string;
  gestorId?: string;
  centroCusto?: string;
  colaboradores: number;
  ativo: boolean;
}

export function useDepartamentos() {
  const empresaId = useAuthStore((state) => state.user?.empresaId);
  return useQuery<Departamento[]>({
    queryKey: ['departamentos', empresaId],
    queryFn: async () => {
      const r = await api.get('/departamentos', { params: { empresaId } });
      return r.data;
    },
    enabled: !!empresaId,
  });
}

export function useDepartamento(id: string) {
  return useQuery<Departamento>({
    queryKey: ['departamento', id],
    queryFn: async () => {
      const r = await api.get(`/departamentos/${id}`);
      return r.data;
    },
    enabled: !!id,
  });
}

export function useCreateDepartamento() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: Partial<Departamento>) => {
      const r = await api.post('/departamentos', data);
      return r.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['departamentos'] });
      toast({ title: 'Departamento criado' });
    },
  });
}

export function useUpdateDepartamento() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Departamento> }) => {
      const r = await api.put(`/departamentos/${id}`, data);
      return r.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['departamentos'] });
      toast({ title: 'Departamento atualizado' });
    },
  });
}
