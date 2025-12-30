/**
 * @fileoverview Hook para gerenciamento de escalas de trabalho
 * @module hooks/useEscalas
 * @version V8.4
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

// ============================================
// TIPOS
// ============================================

export interface Escala {
  id: string;
  nome: string;
  descricao?: string;
  tipo: 'fixa' | 'rotativa' | '12x36' | '6x1' | '5x2' | 'personalizada';
  carga_horaria_semanal: number;
  tolerancia_minutos: number;
  intervalo_minutos: number;
  horarios: HorarioEscala[];
  ativa: boolean;
  empresa_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface HorarioEscala {
  dia_semana: number; // 0-6 (Domingo-Sábado)
  entrada: string; // HH:mm
  saida: string;
  entrada_intervalo?: string;
  saida_intervalo?: string;
  folga: boolean;
}

export interface EscalaFormData {
  nome: string;
  descricao?: string;
  tipo: Escala['tipo'];
  carga_horaria_semanal: number;
  tolerancia_minutos: number;
  intervalo_minutos: number;
  horarios: HorarioEscala[];
  ativa: boolean;
}

// ============================================
// QUERY KEYS
// ============================================

const QUERY_KEYS = {
  escalas: ['escalas'] as const,
  escala: (id: string) => ['escalas', id] as const,
  escalasPorEmpresa: (empresaId: string) => ['escalas', 'empresa', empresaId] as const,
};

// ============================================
// HOOK PRINCIPAL
// ============================================

export function useEscalas(empresaId?: string) {
  const queryClient = useQueryClient();

  // Listar escalas
  const {
    data: escalas = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: empresaId ? QUERY_KEYS.escalasPorEmpresa(empresaId) : QUERY_KEYS.escalas,
    queryFn: async () => {
      logger.info('[useEscalas] Buscando escalas', { empresaId });

      let query = supabase
        .from('escalas')
        .select('*')
        .order('nome');

      if (empresaId) {
        query = query.eq('empresa_id', empresaId);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('[useEscalas] Erro ao buscar escalas', { error });
        throw error;
      }

      return data as Escala[];
    },
  });

  // Criar escala
  const createMutation = useMutation({
    mutationFn: async (dados: EscalaFormData) => {
      logger.info('[useEscalas] Criando escala', { nome: dados.nome });

      const { data, error } = await supabase
        .from('escalas')
        .insert({
          ...dados,
          horarios: JSON.stringify(dados.horarios),
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.escalas });
      toast.success('Escala criada com sucesso!');
    },
    onError: (error) => {
      logger.error('[useEscalas] Erro ao criar escala', { error });
      toast.error('Erro ao criar escala');
    },
  });

  // Atualizar escala
  const updateMutation = useMutation({
    mutationFn: async ({ id, dados }: { id: string; dados: Partial<EscalaFormData> }) => {
      logger.info('[useEscalas] Atualizando escala', { id });

      const updateData: Record<string, unknown> = {
        ...dados,
        updated_at: new Date().toISOString(),
      };

      if (dados.horarios) {
        updateData.horarios = JSON.stringify(dados.horarios);
      }

      const { data, error } = await supabase
        .from('escalas')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.escalas });
      toast.success('Escala atualizada!');
    },
    onError: (error) => {
      logger.error('[useEscalas] Erro ao atualizar escala', { error });
      toast.error('Erro ao atualizar escala');
    },
  });

  // Excluir escala
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      logger.info('[useEscalas] Excluindo escala', { id });

      const { error } = await supabase
        .from('escalas')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.escalas });
      toast.success('Escala excluída!');
    },
    onError: (error) => {
      logger.error('[useEscalas] Erro ao excluir escala', { error });
      toast.error('Erro ao excluir escala');
    },
  });

  // Buscar por ID
  const buscarPorId = async (id: string): Promise<Escala | null> => {
    const { data, error } = await supabase
      .from('escalas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data as Escala;
  };

  return {
    // Dados
    escalas,
    loading,
    error,

    // Ações
    refetch,
    createEscala: createMutation.mutateAsync,
    updateEscala: (id: string, dados: Partial<EscalaFormData>) => 
      updateMutation.mutateAsync({ id, dados }),
    deleteEscala: deleteMutation.mutateAsync,
    buscarPorId,

    // Estados de mutação
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

// ============================================
// HOOK PARA ESCALA ÚNICA
// ============================================

export function useEscala(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.escala(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('escalas')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Escala;
    },
    enabled: !!id,
  });
}

// ============================================
// ESCALAS PADRÃO
// ============================================

export const ESCALAS_PADRAO: Omit<Escala, 'id' | 'created_at'>[] = [
  {
    nome: '5x2 Comercial',
    descricao: 'Segunda a Sexta, 44h semanais',
    tipo: '5x2',
    carga_horaria_semanal: 44,
    tolerancia_minutos: 10,
    intervalo_minutos: 60,
    ativa: true,
    horarios: [
      { dia_semana: 1, entrada: '08:00', saida: '17:48', entrada_intervalo: '12:00', saida_intervalo: '13:00', folga: false },
      { dia_semana: 2, entrada: '08:00', saida: '17:48', entrada_intervalo: '12:00', saida_intervalo: '13:00', folga: false },
      { dia_semana: 3, entrada: '08:00', saida: '17:48', entrada_intervalo: '12:00', saida_intervalo: '13:00', folga: false },
      { dia_semana: 4, entrada: '08:00', saida: '17:48', entrada_intervalo: '12:00', saida_intervalo: '13:00', folga: false },
      { dia_semana: 5, entrada: '08:00', saida: '17:48', entrada_intervalo: '12:00', saida_intervalo: '13:00', folga: false },
      { dia_semana: 6, entrada: '00:00', saida: '00:00', folga: true },
      { dia_semana: 0, entrada: '00:00', saida: '00:00', folga: true },
    ],
  },
  {
    nome: '6x1 Comércio',
    descricao: 'Segunda a Sábado, folga domingo',
    tipo: '6x1',
    carga_horaria_semanal: 44,
    tolerancia_minutos: 10,
    intervalo_minutos: 60,
    ativa: true,
    horarios: [
      { dia_semana: 1, entrada: '08:00', saida: '16:20', entrada_intervalo: '12:00', saida_intervalo: '13:00', folga: false },
      { dia_semana: 2, entrada: '08:00', saida: '16:20', entrada_intervalo: '12:00', saida_intervalo: '13:00', folga: false },
      { dia_semana: 3, entrada: '08:00', saida: '16:20', entrada_intervalo: '12:00', saida_intervalo: '13:00', folga: false },
      { dia_semana: 4, entrada: '08:00', saida: '16:20', entrada_intervalo: '12:00', saida_intervalo: '13:00', folga: false },
      { dia_semana: 5, entrada: '08:00', saida: '16:20', entrada_intervalo: '12:00', saida_intervalo: '13:00', folga: false },
      { dia_semana: 6, entrada: '08:00', saida: '12:00', folga: false },
      { dia_semana: 0, entrada: '00:00', saida: '00:00', folga: true },
    ],
  },
  {
    nome: '12x36',
    descricao: 'Plantão 12 horas, folga 36 horas',
    tipo: '12x36',
    carga_horaria_semanal: 42,
    tolerancia_minutos: 15,
    intervalo_minutos: 60,
    ativa: true,
    horarios: [],
  },
];

export default useEscalas;
