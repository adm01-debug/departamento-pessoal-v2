// @ts-nocheck
// V18: useColaboradores Hook - Formatado e Documentado
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useToast } from './useToast';

/**
 * Interface que define a estrutura de um colaborador.
 */
export interface Colaborador {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  salario: number;
  status: string;
  avatar?: string;
}

/**
 * Hook para buscar a lista de colaboradores, com suporte a filtros.
 * @param filtros Objeto contendo filtros para a busca.
 * @returns Retorna um objeto com os dados da query e funções auxiliares.
 */
export function useColaboradores(filtros?: { status?: string; departamentoId?: string }) {
  return useQuery<Colaborador[]>({
    queryKey: ['colaboradores', filtros],
    queryFn: async () => {
      const r = await api.get('/colaboradores', { params: filtros });
      return r.data;
    },
  });
}

/**
 * Hook para buscar um colaborador específico pelo ID.
 * @param id ID do colaborador a ser buscado.
 * @returns Retorna um objeto com os dados da query e funções auxiliares.
 */
export function useColaborador(id: string) {
  return useQuery<Colaborador>({
    queryKey: ['colaborador', id],
    queryFn: async () => {
      const r = await api.get(`/colaboradores/${id}`);
      return r.data;
    },
    enabled: !!id,
  });
}

/**
 * Hook para criar um novo colaborador.
 * @returns Retorna um objeto com a função mutate para criar o colaborador.
 */
export function useCreateColaborador() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: any) => {
      const r = await api.post('/colaboradores', data);
      return r.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['colaboradores'] });
      toast({ title: 'Colaborador criado com sucesso' });
    },
  });
}

/**
 * Hook para atualizar os dados de um colaborador existente.
 * @returns Retorna um objeto com a função mutate para atualizar o colaborador.
 */
export function useUpdateColaborador() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const r = await api.put(`/colaboradores/${id}`, data);
      return r.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['colaboradores'] });
      toast({ title: 'Colaborador atualizado' });
    },
  });
}

/**
 * Hook para remover um colaborador.
 * @returns Retorna um objeto com a função mutate para remover o colaborador.
 */
export function useDeleteColaborador() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/colaboradores/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['colaboradores'] });
      toast({ title: 'Colaborador removido' });
    },
  });
}
