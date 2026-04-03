import { supabase } from '@/integrations/supabase/client';

export const edgeFunctionsService = {
  /** Dispara alertas automáticos de DP via email */
  dispararAlertasDP: async () => {
    const { data, error } = await supabase.functions.invoke('alertas-dp', {
      body: { trigger: 'manual' },
    });
    if (error) throw error;
    return data;
  },

  /** Envia relatório por email via Resend */
  enviarRelatorioEmail: async (params: {
    tipo: string;
    destinatarios: string[];
    empresaId: string;
    competencia?: string;
  }) => {
    const { data, error } = await supabase.functions.invoke('enviar-relatorio', {
      body: params,
    });
    if (error) throw error;
    return data;
  },

  /** Gera guias DARF/GPS/FGTS via edge function */
  gerarGuias: async (params: {
    empresaId: string;
    competencia: string;
    tipo: 'darf' | 'gps' | 'fgts' | 'todos';
  }) => {
    const { data, error } = await supabase.functions.invoke('gerar-guias', {
      body: params,
    });
    if (error) throw error;
    return data;
  },

  /** Processa ponto do período via edge function */
  processarPonto: async (params: {
    empresaId: string;
    dataInicio: string;
    dataFim: string;
  }) => {
    const { data, error } = await supabase.functions.invoke('processar-ponto', {
      body: params,
    });
    if (error) throw error;
    return data;
  },

  /** Calcula férias via edge function */
  calcularFerias: async (params: {
    salario_base: number;
    dias_ferias?: number;
    dias_abono?: number;
    colaborador_id?: string;
  }) => {
    const { data, error } = await supabase.functions.invoke('calcular-ferias', {
      body: params,
    });
    if (error) throw error;
    return data;
  },

  /** Calcula folha via edge function server-side */
  calcularFolha: async (params: {
    empresaId: string;
    competencia: string;
  }) => {
    const { data, error } = await supabase.functions.invoke('calcular-folha', {
      body: params,
    });
    if (error) throw error;
    return data;
  },

  /** Calcula rescisão via edge function */
  calcularRescisao: async (params: {
    salario_base: number;
    data_admissao: string;
    data_demissao: string;
    tipo_rescisao: string;
    aviso_previo: string;
    saldo_fgts: number;
    ferias_vencidas: number;
    dependentes_irrf: number;
  }) => {
    const { data, error } = await supabase.functions.invoke('calcular-rescisao', {
      body: params,
    });
    if (error) throw error;
    return data;
  },

  /** Exportação server-side */
  exportarDados: async (params: {
    tabela: string;
    formato: 'csv' | 'json';
    filtros?: Record<string, any>;
  }) => {
    const { data, error } = await supabase.functions.invoke('exportacao', {
      body: params,
    });
    if (error) throw error;
    return data;
  },
};
