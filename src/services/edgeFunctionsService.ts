import { supabase } from '@/integrations/supabase/client';
import { bitrixBreaker, resendBreaker } from '@/lib/circuitBreaker';

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
    return resendBreaker.execute(async () => {
      const { data, error } = await supabase.functions.invoke('enviar-relatorio', {
        body: params,
      });
      if (error) throw error;
      return data;
    });
  },

  /** Gera guias DARF/GPS/FGTS via edge function */
  gerarGuias: async (params: {
    empresaId: string;
    competencia: string;
    tipo: 'darf' | 'gps' | 'fgts' | 'fgts_digital' | 'todos';
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

  /** Health check do sistema */
  healthcheck: async () => {
    const { data, error } = await supabase.functions.invoke('healthcheck', {
      body: {},
    });
    if (error) throw error;
    return data;
  },

  /** Limpeza de dados expirados */
  limpezaDados: async () => {
    const { data, error } = await supabase.functions.invoke('limpeza', {
      body: {},
    });
    if (error) throw error;
    return data;
  },

  /** Backup server-side */
  backupServidor: async (empresaId?: string) => {
    const { data, error } = await supabase.functions.invoke('backup', {
      body: { empresaId },
    });
    if (error) throw error;
    return data;
  },

  /** OCR de documentos via AI */
  ocrDocumento: async (params: {
    fileUrl?: string;
    bucket?: string;
    filePath?: string;
    documentType?: 'cpf' | 'rg' | 'ctps' | 'comprovante_endereco';
  }) => {
    const { data, error } = await supabase.functions.invoke('OCR', {
      body: params,
    });
    if (error) throw error;
    return data;
  },

  /** Métricas do sistema */
  metricas: async (empresaId: string) => {
    const { data, error } = await supabase.functions.invoke('metricas', {
      body: { empresaId },
    });
    if (error) throw error;
    return data;
  },

  /** Notificações */
  enviarNotificacao: async (params: {
    action: 'enviar' | 'listar';
    empresaId?: string;
    tipo?: string;
    destinatarios?: { user_id: string }[];
    assunto?: string;
    conteudo?: string;
  }) => {
    const { data, error } = await supabase.functions.invoke('notificacao', {
      body: params,
    });
    if (error) throw error;
    return data;
  },

  /** Processar agendamentos de relatórios */
  processarAgendamentos: async () => {
    const { data, error } = await supabase.functions.invoke('processar-agendamentos', {
      body: {},
    });
    if (error) throw error;
    return data;
  },

  /** Gerar holerite server-side */
  gerarHolerite: async (params: {
    colaboradorId: string;
    competencia: string;
  }) => {
    const { data, error } = await supabase.functions.invoke('gerar-holerite', {
      body: params,
    });
    if (error) throw error;
    return data;
  },

  /** Assinatura digital */
  assinaturaDigital: async (params: {
    action: 'verificar' | 'assinar' | 'listar';
    tokenId?: string;
    admissaoId?: string;
    assinaturaBase64?: string;
    ipAddress?: string;
  }) => {
    const { data, error } = await supabase.functions.invoke('assinaturaDigital', {
      body: params,
    });
    if (error) throw error;
    return data;
  },

  /** Cache de dados */
  cache: async (params: {
    action: 'get' | 'set' | 'invalidate' | 'query_cached' | 'stats';
    key?: string;
    ttlSeconds?: number;
    table?: string;
    query?: Record<string, any>;
  }) => {
    const { data, error } = await supabase.functions.invoke('cache', {
      body: params,
    });
    if (error) throw error;
    return data;
  },

  /** Criptografia */
  criptografia: async (params: {
    action: 'encrypt' | 'decrypt' | 'hash' | 'generate_token';
    data?: any;
    password?: string;
  }) => {
    const { data, error } = await supabase.functions.invoke('criptografia', {
      body: params,
    });
    if (error) throw error;
    return data;
  },

  /** Importação de dados */
  importacao: async (params: {
    action: 'validar' | 'importar' | 'template';
    tabela: string;
    formato?: 'csv' | 'json';
    csvContent?: string;
    dados?: any;
    empresaId?: string;
  }) => {
    const { data, error } = await supabase.functions.invoke('importacao', {
      body: params,
    });
    if (error) throw error;
    return data;
  },

  /** Sincronizar Bitrix24 */
  sincronizarBitrix: async (params: {
    action: 'sync_departamentos' | 'sync_colaboradores' | 'sync_cargos' | 'sync_all' | 'status';
  }) => {
    return bitrixBreaker.execute(async () => {
      const { data, error } = await supabase.functions.invoke('sincronizar-bitrix', {
        body: params,
      });
      if (error) throw error;
      return data;
    });
  },
};
