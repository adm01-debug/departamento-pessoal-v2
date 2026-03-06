// @ts-nocheck
// V18: RelatorioService - Expandido e Documentado
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';

export type TipoRelatorio = 
  | 'folha' 
  | 'ferias' 
  | 'rescisao' 
  | 'ponto' 
  | 'beneficios' 
  | 'encargos' 
  | 'analitico'
  | 'colaboradores'
  | 'admissoes'
  | 'demissoes'
  | 'banco_horas';

export interface RelatorioParams {
  dataInicio?: string;
  dataFim?: string;
  competencia?: string;
  departamentoId?: string;
  colaboradorId?: string;
  formato?: 'pdf' | 'excel' | 'csv';
}

export interface RelatorioGerado {
  id?: string;
  tipo: TipoRelatorio;
  geradoEm: string;
  params: RelatorioParams;
  dados: any[];
  totalRegistros: number;
}

export interface RelatorioAgendado {
  id: string;
  empresa_id: string;
  tipo: TipoRelatorio;
  periodicidade: 'diario' | 'semanal' | 'mensal';
  email: string;
  ativo: boolean;
  proxima_execucao: string;
}

export const relatorioServiceReal = {
  /**
   * Gera relatório por tipo
   */
  async gerar(empresaId: string, tipo: TipoRelatorio, params: RelatorioParams = {}): Promise<RelatorioGerado> {
    let dados: any[] = [];
    
    switch (tipo) {
      case 'colaboradores':
        const { data: colaboradores } = await supabase
          .from('colaboradores')
          .select('*')
          .eq('empresa_id', empresaId)
          .eq('status', 'ativo');
        dados = colaboradores || [];
        break;
        
      case 'folha':
        const { data: folha } = await supabase
          .from('folha_pagamento')
          .select('*, colaborador:colaboradores(nome, cpf)')
          .eq('empresa_id', empresaId)
          .eq('competencia', params.competencia || new Date().toISOString().slice(0, 7));
        dados = folha || [];
        break;
        
      case 'ferias':
        const { data: ferias } = await supabase
          .from('ferias')
          .select('*, colaborador:colaboradores(nome, cpf)')
          .eq('empresa_id', empresaId);
        dados = ferias || [];
        break;
        
      case 'ponto':
        let pontoQuery = supabase
          .from('registros_ponto')
          .select('*, colaborador:colaboradores(nome)')
          .eq('empresa_id', empresaId);
        if (params.dataInicio) pontoQuery = pontoQuery.gte('data', params.dataInicio);
        if (params.dataFim) pontoQuery = pontoQuery.lte('data', params.dataFim);
        const { data: ponto } = await pontoQuery;
        dados = ponto || [];
        break;
        
      case 'beneficios':
        const { data: beneficios } = await supabase
          .from('beneficios')
          .select('*, colaborador:colaboradores(nome)')
          .eq('empresa_id', empresaId)
          .eq('ativo', true);
        dados = beneficios || [];
        break;
        
      case 'banco_horas':
        const { data: bancoHoras } = await supabase
          .from('banco_horas')
          .select('*, colaborador:colaboradores(nome)')
          .eq('empresa_id', empresaId);
        dados = bancoHoras || [];
        break;
        
      default:
        dados = [];
    }
    
    // Salvar histórico
    await supabase.from('relatorios_historico').insert({
      empresa_id: empresaId,
      tipo,
      params,
      total_registros: dados.length
    });
    
    return {
      tipo,
      geradoEm: new Date().toISOString(),
      params,
      dados,
      totalRegistros: dados.length
    };
  },

  /**
   * Obtém histórico de relatórios gerados
   */
  async getHistorico(empresaId: string, limite: number = 50): Promise<any[]> {
    const { data, error } = await supabase
      .from('relatorios_historico')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('created_at', { ascending: false })
      .limit(limite);
    
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  /**
   * Agenda relatório recorrente
   */
  async agendar(
    empresaId: string, 
    tipo: TipoRelatorio, 
    periodicidade: 'diario' | 'semanal' | 'mensal',
    email: string,
    params: RelatorioParams = {}
  ): Promise<RelatorioAgendado> {
    const { data, error } = await supabase
      .from('relatorios_agendados')
      .insert({
        empresa_id: empresaId,
        tipo,
        periodicidade,
        email,
        params,
        ativo: true
      })
      .select()
      .single();
    
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  /**
   * Lista relatórios agendados
   */
  async listarAgendados(empresaId: string): Promise<RelatorioAgendado[]> {
    const { data, error } = await supabase
      .from('relatorios_agendados')
      .select('*')
      .eq('empresa_id', empresaId)
      .eq('ativo', true);
    
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  /**
   * Cancela agendamento
   */
  async cancelarAgendamento(id: string): Promise<void> {
    const { error } = await supabase
      .from('relatorios_agendados')
      .update({ ativo: false })
      .eq('id', id);
    
    if (error) throw new Error(handleSupabaseError(error));
  },

  /**
   * Obtém tipos de relatórios disponíveis
   */
  getTiposDisponiveis(): { tipo: TipoRelatorio; nome: string; descricao: string }[] {
    return [
      { tipo: 'colaboradores', nome: 'Colaboradores', descricao: 'Lista de colaboradores ativos' },
      { tipo: 'folha', nome: 'Folha de Pagamento', descricao: 'Relatório da folha mensal' },
      { tipo: 'ferias', nome: 'Férias', descricao: 'Controle de férias' },
      { tipo: 'ponto', nome: 'Ponto', descricao: 'Registros de ponto' },
      { tipo: 'beneficios', nome: 'Benefícios', descricao: 'Benefícios ativos' },
      { tipo: 'encargos', nome: 'Encargos', descricao: 'INSS, FGTS, IRRF' },
      { tipo: 'banco_horas', nome: 'Banco de Horas', descricao: 'Saldos de banco de horas' },
      { tipo: 'analitico', nome: 'Analítico', descricao: 'Relatório detalhado' }
    ];
  }
};

export default relatorioServiceReal;
