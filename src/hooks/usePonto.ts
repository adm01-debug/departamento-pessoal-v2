// V18: usePonto Hook - Formatado e Documentado
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pontoService } from '@/services';
import { useToast } from './useToast';

export type TipoRegistro = 'entrada' | 'saida_almoco' | 'retorno_almoco' | 'saida';

export interface RegistroPonto {
  id: string;
  colaborador_id: string;
  colaborador_nome?: string;
  data: string;
  entrada?: string;
  saida_almoco?: string;
  retorno_almoco?: string;
  saida?: string;
  horas_trabalhadas: number;
  horas_extras: number;
  status: 'normal' | 'ajustado' | 'pendente';
}

export interface PontoFilters {
  data?: string;
  colaborador_id?: string;
  competencia?: string;
}

/**
 * Hook para listar registros de ponto
 */
export function usePontos(filtros?: PontoFilters) {
  return useQuery<RegistroPonto[]>({
    queryKey: ['ponto', filtros],
    queryFn: async () => {
      return pontoService.list(filtros);
    },
    staleTime: 60 * 1000, // 1 minuto
  });
}

/**
 * Hook para ponto do dia
 */
export function usePontoHoje(colaboradorId: string) {
  return useQuery<RegistroPonto | null>({
    queryKey: ['ponto-hoje', colaboradorId],
    queryFn: async () => {
      const hoje = new Date().toISOString().split('T')[0];
      return pontoService.getByData(colaboradorId, hoje);
    },
    enabled: !!colaboradorId,
    refetchInterval: 60 * 1000, // Atualiza a cada minuto
  });
}

/**
 * Hook para registrar ponto
 */
export function useRegistrarPonto() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      colaboradorId, 
      tipo 
    }: { 
      colaboradorId: string; 
      tipo: TipoRegistro 
    }) => {
      return pontoService.registrar(colaboradorId, tipo);
    },
    onSuccess: (_, { tipo }) => {
      queryClient.invalidateQueries({ queryKey: ['ponto'] });
      queryClient.invalidateQueries({ queryKey: ['ponto-hoje'] });
      
      const mensagens: Record<TipoRegistro, string> = {
        entrada: 'Entrada registrada!',
        saida_almoco: 'Saída para almoço registrada!',
        retorno_almoco: 'Retorno do almoço registrado!',
        saida: 'Saída registrada!'
      };
      
      toast({ title: mensagens[tipo] });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro ao registrar ponto', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });
}

/**
 * Hook para ajustar ponto
 */
export function useAjustarPonto() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      pontoId: string;
      campo: string;
      valor: string;
      justificativa: string;
    }) => {
      return pontoService.ajustar(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ponto'] });
      toast({ title: 'Ponto ajustado com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro ao ajustar ponto', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });
}

/**
 * Hook para espelho de ponto mensal
 */
export function useEspelhoPonto(colaboradorId: string, competencia: string) {
  return useQuery({
    queryKey: ['espelho-ponto', colaboradorId, competencia],
    queryFn: async () => {
      return pontoService.getEspelho(colaboradorId, competencia);
    },
    enabled: !!colaboradorId && !!competencia,
  });
}

export default usePontos;
