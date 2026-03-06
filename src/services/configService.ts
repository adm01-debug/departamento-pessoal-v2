// @ts-nocheck
// V18: ConfigService - Configurações do Sistema
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';

export interface ConfiguracaoEmpresa {
  id: string;
  empresa_id: string;
  // Folha de Pagamento
  dia_pagamento: number;
  dia_adiantamento: number;
  percentual_adiantamento: number;
  // Ponto
  tolerancia_minutos: number;
  horas_extras_automatico: boolean;
  banco_horas_ativo: boolean;
  limite_banco_horas: number;
  // Férias
  dias_antecedencia_ferias: number;
  permite_abono: boolean;
  // Benefícios
  desconto_vt_percentual: number;
  // eSocial
  ambiente_esocial: 'producao' | 'homologacao';
  certificado_digital_valido: boolean;
  // Geral
  tema: 'light' | 'dark' | 'system';
  idioma: 'pt-BR';
  timezone: string;
  formato_data: string;
  formato_moeda: string;
}

export interface ConfiguracaoUsuario {
  usuario_id: string;
  tema: 'light' | 'dark' | 'system';
  notificacoes_email: boolean;
  notificacoes_push: boolean;
  dashboard_widgets: string[];
  itens_por_pagina: number;
}

const CONFIG_PADRAO_EMPRESA: Omit<ConfiguracaoEmpresa, 'id' | 'empresa_id'> = {
  dia_pagamento: 5,
  dia_adiantamento: 20,
  percentual_adiantamento: 40,
  tolerancia_minutos: 10,
  horas_extras_automatico: true,
  banco_horas_ativo: true,
  limite_banco_horas: 40,
  dias_antecedencia_ferias: 30,
  permite_abono: true,
  desconto_vt_percentual: 6,
  ambiente_esocial: 'homologacao',
  certificado_digital_valido: false,
  tema: 'light',
  idioma: 'pt-BR',
  timezone: 'America/Sao_Paulo',
  formato_data: 'dd/MM/yyyy',
  formato_moeda: 'BRL'
};

const CONFIG_PADRAO_USUARIO: Omit<ConfiguracaoUsuario, 'usuario_id'> = {
  tema: 'system',
  notificacoes_email: true,
  notificacoes_push: true,
  dashboard_widgets: ['colaboradores', 'folha', 'ferias', 'pendencias'],
  itens_por_pagina: 20
};

export const configServiceReal = {
  /**
   * Obtém configurações da empresa
   */
  async getEmpresa(empresaId: string): Promise<ConfiguracaoEmpresa> {
    const { data, error } = await supabase
      .from('configuracoes_empresa')
      .select('*')
      .eq('empresa_id', empresaId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(handleSupabaseError(error));
    }

    if (!data) {
      // Criar configuração padrão
      const { data: newConfig, error: insertError } = await supabase
        .from('configuracoes_empresa')
        .insert({ empresa_id: empresaId, ...CONFIG_PADRAO_EMPRESA })
        .select()
        .single();

      if (insertError) throw new Error(handleSupabaseError(insertError));
      return newConfig;
    }

    return data;
  },

  /**
   * Atualiza configurações da empresa
   */
  async atualizarEmpresa(empresaId: string, config: Partial<ConfiguracaoEmpresa>): Promise<ConfiguracaoEmpresa> {
    const { data, error } = await supabase
      .from('configuracoes_empresa')
      .update(config)
      .eq('empresa_id', empresaId)
      .select()
      .single();

    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  /**
   * Obtém configurações do usuário
   */
  async getUsuario(usuarioId: string): Promise<ConfiguracaoUsuario> {
    const { data, error } = await supabase
      .from('configuracoes_usuario')
      .select('*')
      .eq('usuario_id', usuarioId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(handleSupabaseError(error));
    }

    return data || { usuario_id: usuarioId, ...CONFIG_PADRAO_USUARIO };
  },

  /**
   * Atualiza configurações do usuário
   */
  async atualizarUsuario(usuarioId: string, config: Partial<ConfiguracaoUsuario>): Promise<void> {
    const { error } = await supabase
      .from('configuracoes_usuario')
      .upsert({ usuario_id: usuarioId, ...config });

    if (error) throw new Error(handleSupabaseError(error));
  },

  /**
   * Reseta configurações para padrão
   */
  async resetarEmpresa(empresaId: string): Promise<ConfiguracaoEmpresa> {
    return this.atualizarEmpresa(empresaId, CONFIG_PADRAO_EMPRESA);
  },

  /**
   * Reseta configurações do usuário
   */
  async resetarUsuario(usuarioId: string): Promise<void> {
    await this.atualizarUsuario(usuarioId, CONFIG_PADRAO_USUARIO);
  },

  /**
   * Valida certificado digital
   */
  async validarCertificado(empresaId: string): Promise<{ valido: boolean; expiraEm?: string; erro?: string }> {
    // Simulação - em produção integraria com API de certificado
    const config = await this.getEmpresa(empresaId);
    return {
      valido: config.certificado_digital_valido,
      expiraEm: config.certificado_digital_valido ? '2027-01-01' : undefined
    };
  },

  /**
   * Obtém configurações de folha
   */
  async getConfigFolha(empresaId: string): Promise<Pick<ConfiguracaoEmpresa, 'dia_pagamento' | 'dia_adiantamento' | 'percentual_adiantamento'>> {
    const config = await this.getEmpresa(empresaId);
    return {
      dia_pagamento: config.dia_pagamento,
      dia_adiantamento: config.dia_adiantamento,
      percentual_adiantamento: config.percentual_adiantamento
    };
  },

  /**
   * Obtém configurações de ponto
   */
  async getConfigPonto(empresaId: string): Promise<Pick<ConfiguracaoEmpresa, 'tolerancia_minutos' | 'horas_extras_automatico' | 'banco_horas_ativo' | 'limite_banco_horas'>> {
    const config = await this.getEmpresa(empresaId);
    return {
      tolerancia_minutos: config.tolerancia_minutos,
      horas_extras_automatico: config.horas_extras_automatico,
      banco_horas_ativo: config.banco_horas_ativo,
      limite_banco_horas: config.limite_banco_horas
    };
  }
};

export default configServiceReal;
