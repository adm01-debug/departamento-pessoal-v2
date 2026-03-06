// @ts-nocheck
// V18: BackupService - Sistema de Backup Completo
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';

export interface BackupConfig {
  incluirColaboradores: boolean;
  incluirFolha: boolean;
  incluirFerias: boolean;
  incluirPonto: boolean;
  incluirBeneficios: boolean;
  incluirDocumentos: boolean;
  formato: 'json' | 'csv';
}

export interface BackupHistorico {
  id: string;
  empresa_id: string;
  tipo: 'manual' | 'automatico';
  tamanho_bytes: number;
  tabelas_incluidas: string[];
  status: 'sucesso' | 'erro' | 'em_andamento';
  created_at: string;
  arquivo_url?: string;
}

export interface BackupDados {
  metadata: {
    versao: string;
    data: string;
    empresa_id: string;
    tabelas: string[];
  };
  dados: Record<string, any[]>;
}

export const backupServiceReal = {
  /**
   * Cria backup completo da empresa
   */
  async criar(empresaId: string, config: Partial<BackupConfig> = {}): Promise<BackupDados> {
    const defaultConfig: BackupConfig = {
      incluirColaboradores: true,
      incluirFolha: true,
      incluirFerias: true,
      incluirPonto: true,
      incluirBeneficios: true,
      incluirDocumentos: false,
      formato: 'json',
      ...config
    };

    const dados: Record<string, any[]> = {};
    const tabelas: string[] = [];

    // Colaboradores
    if (defaultConfig.incluirColaboradores) {
      const { data } = await supabase
        .from('colaboradores')
        .select('*')
        .eq('empresa_id', empresaId);
      dados.colaboradores = data || [];
      tabelas.push('colaboradores');
    }

    // Folha de Pagamento
    if (defaultConfig.incluirFolha) {
      const { data } = await supabase
        .from('folhas_pagamento')
        .select('*')
        .eq('empresa_id', empresaId);
      dados.folha_pagamento = data || [];
      tabelas.push('folha_pagamento');
    }

    // Férias
    if (defaultConfig.incluirFerias) {
      const { data } = await supabase
        .from('ferias')
        .select('*')
        .eq('empresa_id', empresaId);
      dados.ferias = data || [];
      tabelas.push('ferias');
    }

    // Ponto
    if (defaultConfig.incluirPonto) {
      const { data } = await supabase
        .from('registros_ponto')
        .select('*')
        .eq('empresa_id', empresaId);
      dados.registros_ponto = data || [];
      tabelas.push('registros_ponto');
    }

    // Benefícios
    if (defaultConfig.incluirBeneficios) {
      const { data } = await supabase
        .from('beneficios')
        .select('*')
        .eq('empresa_id', empresaId);
      dados.beneficios = data || [];
      tabelas.push('beneficios');
    }

    const backup: BackupDados = {
      metadata: {
        versao: '18.0.0',
        data: new Date().toISOString(),
        empresa_id: empresaId,
        tabelas
      },
      dados
    };

    // Salvar histórico
    const tamanho = JSON.stringify(backup).length;
    await supabase.from('backup_historico').insert({
      empresa_id: empresaId,
      tipo: 'manual',
      tamanho_bytes: tamanho,
      tabelas_incluidas: tabelas,
      status: 'sucesso'
    });

    return backup;
  },

  /**
   * Restaura backup
   */
  async restaurar(empresaId: string, backup: BackupDados): Promise<{ sucesso: boolean; erros: string[] }> {
    const erros: string[] = [];

    try {
      // Validar backup
      if (!backup.metadata || !backup.dados) {
        throw new Error('Formato de backup inválido');
      }

      // Restaurar cada tabela
      for (const [tabela, registros] of Object.entries(backup.dados)) {
        if (registros.length === 0) continue;

        // Limpar dados existentes (opcional - cuidado!)
        // await supabase.from(tabela).delete().eq('empresa_id', empresaId);

        // Inserir novos dados
        const { error } = await supabase.from(tabela).upsert(registros);
        if (error) {
          erros.push(`Erro ao restaurar ${tabela}: ${handleSupabaseError(error)}`);
        }
      }

      return { sucesso: erros.length === 0, erros };
    } catch (error: any) {
      return { sucesso: false, erros: [error.message] };
    }
  },

  /**
   * Lista histórico de backups
   */
  async getHistorico(empresaId: string): Promise<BackupHistorico[]> {
    const { data, error } = await supabase
      .from('backup_historico')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  /**
   * Agenda backup automático
   */
  async agendarAutomatico(empresaId: string, periodicidade: 'diario' | 'semanal' | 'mensal', hora: string = '02:00'): Promise<void> {
    const { error } = await supabase.from('backup_agendamentos').upsert({
      empresa_id: empresaId,
      periodicidade,
      hora_execucao: hora,
      ativo: true
    });

    if (error) throw new Error(handleSupabaseError(error));
  },

  /**
   * Cancela backup automático
   */
  async cancelarAutomatico(empresaId: string): Promise<void> {
    const { error } = await supabase
      .from('backup_agendamentos')
      .update({ ativo: false })
      .eq('empresa_id', empresaId);

    if (error) throw new Error(handleSupabaseError(error));
  },

  /**
   * Exporta backup como arquivo
   */
  exportarComoArquivo(backup: BackupDados, formato: 'json' | 'csv' = 'json'): Blob {
    if (formato === 'json') {
      return new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    }
    // CSV simplificado
    let csv = '';
    for (const [tabela, registros] of Object.entries(backup.dados)) {
      if (registros.length === 0) continue;
      csv += `\n--- ${tabela} ---\n`;
      const headers = Object.keys(registros[0]);
      csv += headers.join(',') + '\n';
      registros.forEach(r => {
        csv += headers.map(h => JSON.stringify(r[h] || '')).join(',') + '\n';
      });
    }
    return new Blob([csv], { type: 'text/csv' });
  }
};

export default backupServiceReal;
