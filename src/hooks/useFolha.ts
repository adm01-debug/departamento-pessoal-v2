// V18: useFolha Hook - Formatado e Documentado
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { folhaService } from '@/services';
import { useToast } from './useToast';

export interface Folha {
  id: string;
  empresa_id: string;
  competencia: string;
  tipo: 'mensal' | 'adiantamento' | 'ferias' | '13_primeira' | '13_segunda';
  status: 'rascunho' | 'calculada' | 'conferida' | 'fechada' | 'paga';
  total_proventos: number;
  total_descontos: number;
  total_liquido: number;
  total_fgts: number;
  total_colaboradores: number;
  data_calculo?: string;
  data_fechamento?: string;
  data_pagamento?: string;
}

export interface FolhaItem {
  id: string;
  folha_id: string;
  colaborador_id: string;
  colaborador_nome: string;
  salario_base: number;
  total_proventos: number;
  total_descontos: number;
  valor_liquido: number;
  inss: number;
  irrf: number;
  fgts: number;
}

/**
 * Hook para listar folhas
 */
export function useFolhas(competencia?: string) {
  return useQuery<Folha[]>({
    queryKey: ['folhas', competencia],
    queryFn: async () => {
      return folhaService.list({ competencia });
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para detalhes da folha
 */
export function useFolhaDetalhes(id: string) {
  return useQuery<{ folha: Folha; itens: FolhaItem[] }>({
    queryKey: ['folha', id],
    queryFn: async () => {
      const folha = await folhaService.getById(id);
      const itens = await folhaService.getItens(id);
      return { folha, itens };
    },
    enabled: !!id,
  });
}

/**
 * Hook para calcular folha
 */
export function useCalcularFolha() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (folhaId: string) => {
      return folhaService.calcular(folhaId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folhas'] });
      queryClient.invalidateQueries({ queryKey: ['folha'] });
      toast({ title: 'Folha calculada com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro ao calcular folha', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });
}

/**
 * Hook para fechar folha
 */
export function useFecharFolha() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (folhaId: string) => {
      return folhaService.fechar(folhaId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folhas'] });
      queryClient.invalidateQueries({ queryKey: ['folha'] });
      toast({ title: 'Folha fechada com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro ao fechar folha', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });
}

/**
 * Hook para reabrir folha
 */
export function useReabrirFolha() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (folhaId: string) => {
      return folhaService.reabrir(folhaId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folhas'] });
      toast({ title: 'Folha reaberta!' });
    },
  });
}

export default useFolhas;
