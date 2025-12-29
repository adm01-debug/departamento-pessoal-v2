/**
 * @fileoverview Service para operações de folha de pagamento
 * @module services/folhaService
 * @version V8.1 - Corrigido por análise QA
 */
import { supabase } from '@/integrations/supabase/client';
import { 
  Holerite, 
  FolhaPagamento, 
  StatusFolha, 
  StatusHolerite,
  TotaisFolha,
  LancamentoFolha,
  EventoVariavel,
} from '@/types/folha';
import { Colaborador } from '@/types/colaborador';
import { 
  calcularINSS, 
  calcularIRRF, 
  calcularFGTS,
  calcularINSSPatronal,
  calcularValeTransporte,
  calcularHoraExtra,
  calcularDSR,
  calcularAdicionalNoturno,
} from '@/lib/calculosTrabalhistas';
import { logger } from '@/lib/logger';

// ============================================
// CONSTANTES
// ============================================

const TABLE_FOLHAS = 'folhas_pagamento';
const TABLE_HOLERITES = 'holerites';
const TABLE_RUBRICAS = 'rubricas_holerite';
const TABLE_LANCAMENTOS = 'lancamentos_folha';
const TABLE_EVENTOS = 'eventos_variaveis';

const HOLERITE_FIELDS = `
  id, colaborador_id, competencia, mes, ano, 
  salario_base, total_proventos, total_descontos, salario_liquido,
  inss, irrf, fgts, inss_patronal,
  horas_extras_50, horas_extras_100, adicional_noturno,
  comissoes, dsr, gratificacoes,
  descontos_vt, descontos_vr, descontos_plano_saude, descontos_pensao,
  outros_proventos, outros_descontos,
  status, empresa_id, created_at, updated_at
`;

const FOLHA_FIELDS = `
  id, competencia, mes, ano, empresa_id, status,
  data_abertura, data_calculo, data_fechamento, data_pagamento,
  total_colaboradores, total_proventos, total_descontos, total_liquido,
  total_fgts, total_inss_patronal, custo_total,
  observacoes, created_at, updated_at
`;

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function arredondar(valor: number): number {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

function formatCompetencia(mes: number, ano: number): string {
  return `${ano}-${String(mes).padStart(2, '0')}`;
}

function parseCompetencia(competencia: string): { mes: number; ano: number } {
  const [ano, mes] = competencia.split('-').map(Number);
  return { mes, ano };
}

// ============================================
// SERVICE DE FOLHA
// ============================================

export const folhaService = {
  // ==========================================
  // FOLHAS DE PAGAMENTO
  // ==========================================

  /**
   * Lista folhas de pagamento
   */
  async listarFolhas(empresa_id?: string, ano?: number): Promise<FolhaPagamento[]> {
    try {
      let query = supabase
        .from(TABLE_FOLHAS)
        .select(FOLHA_FIELDS)
        .order('competencia', { ascending: false });
      
      if (empresa_id) query = query.eq('empresa_id', empresa_id);
      if (ano) query = query.eq('ano', ano);
      
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as FolhaPagamento[];
    } catch (error) {
      logger.error('Erro ao listar folhas:', error);
      throw error;
    }
  },

  /**
   * Busca folha por competência
   */
  async buscarFolha(competencia: string, empresa_id: string): Promise<FolhaPagamento | null> {
    try {
      const { data, error } = await supabase
        .from(TABLE_FOLHAS)
        .select(FOLHA_FIELDS)
        .eq('competencia', competencia)
        .eq('empresa_id', empresa_id)
        .maybeSingle();
      
      if (error) throw error;
      return data as FolhaPagamento | null;
    } catch (error) {
      logger.error('Erro ao buscar folha:', error);
      throw error;
    }
  },

  /**
   * Cria nova folha de pagamento
   */
  async criarFolha(competencia: string, empresa_id: string, created_by?: string): Promise<FolhaPagamento> {
    const { mes, ano } = parseCompetencia(competencia);
    
    // Verificar se já existe
    const existente = await this.buscarFolha(competencia, empresa_id);
    if (existente) {
      throw new Error(`Já existe folha para a competência ${competencia}`);
    }
    
    try {
      const novaFolha = {
        competencia,
        mes,
        ano,
        empresa_id,
        status: 'aberta' as StatusFolha,
        total_colaboradores: 0,
        total_proventos: 0,
        total_descontos: 0,
        total_liquido: 0,
        total_fgts: 0,
        total_inss_patronal: 0,
        custo_total: 0,
        data_abertura: new Date().toISOString(),
        created_by,
      };
      
      const { data, error } = await supabase
        .from(TABLE_FOLHAS)
        .insert(novaFolha)
        .select(FOLHA_FIELDS)
        .single();
      
      if (error) throw error;
      logger.info('Folha criada:', { competencia, empresa_id });
      return data as FolhaPagamento;
    } catch (error) {
      logger.error('Erro ao criar folha:', error);
      throw error;
    }
  },

  /**
   * Atualiza status da folha
   */
  async atualizarStatusFolha(id: string, status: StatusFolha): Promise<FolhaPagamento> {
    try {
      const updateData: Partial<FolhaPagamento> = {
        status,
        updated_at: new Date().toISOString(),
      };
      
      if (status === 'calculada') updateData.data_calculo = new Date().toISOString();
      if (status === 'fechada') updateData.data_fechamento = new Date().toISOString();
      if (status === 'paga') updateData.data_pagamento = new Date().toISOString();
      
      const { data, error } = await supabase
        .from(TABLE_FOLHAS)
        .update(updateData)
        .eq('id', id)
        .select(FOLHA_FIELDS)
        .single();
      
      if (error) throw error;
      return data as FolhaPagamento;
    } catch (error) {
      logger.error('Erro ao atualizar status da folha:', error);
      throw error;
    }
  },

  // ==========================================
  // HOLERITES
  // ==========================================

  /**
   * Lista holerites de uma competência
   */
  async listarHolerites(competencia: string, empresa_id?: string): Promise<Holerite[]> {
    const { mes, ano } = parseCompetencia(competencia);
    
    try {
      let query = supabase
        .from(TABLE_HOLERITES)
        .select(`${HOLERITE_FIELDS}, colaboradores(nome, cpf, cargo_id, departamento_id)`)
        .eq('mes', mes)
        .eq('ano', ano);
      
      if (empresa_id) query = query.eq('empresa_id', empresa_id);
      
      const { data, error } = await query.order('colaboradores(nome)');
      if (error) throw error;
      return (data ?? []) as Holerite[];
    } catch (error) {
      logger.error('Erro ao listar holerites:', error);
      throw error;
    }
  },

  /**
   * Busca holerite específico
   */
  async buscarHolerite(colaborador_id: string, competencia: string): Promise<Holerite | null> {
    const { mes, ano } = parseCompetencia(competencia);
    
    try {
      const { data, error } = await supabase
        .from(TABLE_HOLERITES)
        .select(HOLERITE_FIELDS)
        .eq('colaborador_id', colaborador_id)
        .eq('mes', mes)
        .eq('ano', ano)
        .maybeSingle();
      
      if (error) throw error;
      return data as Holerite | null;
    } catch (error) {
      logger.error('Erro ao buscar holerite:', error);
      throw error;
    }
  },

  /**
   * Calcula holerite de um colaborador
   */
  async calcularHolerite(
    colaborador: Colaborador & { dependentes?: number },
    competencia: string,
    eventosVariaveis?: EventoVariavel[]
  ): Promise<Partial<Holerite>> {
    const { mes, ano } = parseCompetencia(competencia);
    const salarioBase = colaborador.salario || 0;
    const dependentes = colaborador.dependentes || 0;
    
    // Processar eventos variáveis
    let horasExtras50 = 0;
    let horasExtras100 = 0;
    let horasNoturnas = 0;
    let comissoes = 0;
    let gratificacoes = 0;
    let descontosExtras = 0;
    
    if (eventosVariaveis) {
      for (const evento of eventosVariaveis) {
        switch (evento.tipo) {
          case 'hora_extra_50':
            horasExtras50 += calcularHoraExtra(salarioBase, 220, 50) * evento.quantidade;
            break;
          case 'hora_extra_100':
            horasExtras100 += calcularHoraExtra(salarioBase, 220, 100) * evento.quantidade;
            break;
          case 'adicional_noturno':
            horasNoturnas += evento.quantidade;
            break;
          case 'comissao':
            comissoes += evento.valor || 0;
            break;
          case 'bonus':
            gratificacoes += evento.valor || 0;
            break;
          case 'desconto':
            descontosExtras += evento.valor || 0;
            break;
        }
      }
    }
    
    // Calcular proventos
    const adicionalNoturno = calcularAdicionalNoturno(salarioBase, horasNoturnas);
    const dsrComissoes = calcularDSR(comissoes);
    
    const totalProventos = arredondar(
      salarioBase + horasExtras50 + horasExtras100 + 
      adicionalNoturno + comissoes + dsrComissoes + gratificacoes
    );
    
    // Calcular descontos
    const inssCalc = calcularINSS(totalProventos);
    const irrfCalc = calcularIRRF(totalProventos, inssCalc.valorINSS, dependentes);
    const vt = 0; // Depende de configuração
    const planoSaude = 0; // Depende de configuração
    
    const totalDescontos = arredondar(
      inssCalc.valorINSS + irrfCalc.valorIRRF + vt + planoSaude + descontosExtras
    );
    
    // Calcular encargos
    const fgts = calcularFGTS(totalProventos);
    const inssPatronal = calcularINSSPatronal(totalProventos);
    
    // Líquido
    const salarioLiquido = arredondar(totalProventos - totalDescontos);
    
    return {
      colaborador_id: colaborador.id,
      competencia,
      mes,
      ano,
      salario_base: salarioBase,
      total_proventos: totalProventos,
      total_descontos: totalDescontos,
      salario_liquido: salarioLiquido,
      inss: inssCalc.valorINSS,
      irrf: irrfCalc.valorIRRF,
      fgts,
      inss_patronal: inssPatronal,
      horas_extras_50: horasExtras50,
      horas_extras_100: horasExtras100,
      adicional_noturno: adicionalNoturno,
      comissoes,
      dsr: dsrComissoes,
      gratificacoes,
      descontos_vt: vt,
      descontos_plano_saude: planoSaude,
      outros_descontos: descontosExtras,
      status: 'calculado' as StatusHolerite,
      empresa_id: colaborador.empresa_id,
    };
  },

  /**
   * Gera ou atualiza holerite
   */
  async gerarHolerite(
    colaborador: Colaborador & { dependentes?: number },
    competencia: string,
    eventosVariaveis?: EventoVariavel[]
  ): Promise<Holerite> {
    const holeriteCalculado = await this.calcularHolerite(colaborador, competencia, eventosVariaveis);
    
    try {
      // Verificar se já existe
      const existente = await this.buscarHolerite(colaborador.id, competencia);
      
      if (existente) {
        const { data, error } = await supabase
          .from(TABLE_HOLERITES)
          .update({ ...holeriteCalculado, updated_at: new Date().toISOString() })
          .eq('id', existente.id)
          .select(HOLERITE_FIELDS)
          .single();
        
        if (error) throw error;
        return data as Holerite;
      } else {
        const { data, error } = await supabase
          .from(TABLE_HOLERITES)
          .insert({ ...holeriteCalculado, created_at: new Date().toISOString() })
          .select(HOLERITE_FIELDS)
          .single();
        
        if (error) throw error;
        return data as Holerite;
      }
    } catch (error) {
      logger.error('Erro ao gerar holerite:', error);
      throw error;
    }
  },

  // ==========================================
  // TOTALIZADORES
  // ==========================================

  /**
   * Calcula totais da folha
   */
  async calcularTotais(competencia: string, empresa_id: string): Promise<TotaisFolha> {
    const holerites = await this.listarHolerites(competencia, empresa_id);
    
    return holerites.reduce((acc, h) => ({
      totalColaboradores: acc.totalColaboradores + 1,
      totalProventos: arredondar(acc.totalProventos + (h.total_proventos || 0)),
      totalDescontos: arredondar(acc.totalDescontos + (h.total_descontos || 0)),
      totalLiquido: arredondar(acc.totalLiquido + (h.salario_liquido || 0)),
      totalINSS: arredondar(acc.totalINSS + (h.inss || 0)),
      totalIRRF: arredondar(acc.totalIRRF + (h.irrf || 0)),
      totalFGTS: arredondar(acc.totalFGTS + (h.fgts || 0)),
      totalINSSPatronal: arredondar(acc.totalINSSPatronal + (h.inss_patronal || 0)),
      custoTotal: arredondar(acc.custoTotal + (h.total_proventos || 0) + (h.fgts || 0) + (h.inss_patronal || 0)),
    }), {
      totalColaboradores: 0,
      totalProventos: 0,
      totalDescontos: 0,
      totalLiquido: 0,
      totalINSS: 0,
      totalIRRF: 0,
      totalFGTS: 0,
      totalINSSPatronal: 0,
      custoTotal: 0,
    } as TotaisFolha);
  },

  /**
   * Atualiza totais da folha
   */
  async atualizarTotaisFolha(folha_id: string): Promise<FolhaPagamento> {
    const { data: folha } = await supabase
      .from(TABLE_FOLHAS)
      .select('competencia, empresa_id')
      .eq('id', folha_id)
      .single();
    
    if (!folha) throw new Error('Folha não encontrada');
    
    const totais = await this.calcularTotais(folha.competencia, folha.empresa_id);
    
    const { data, error } = await supabase
      .from(TABLE_FOLHAS)
      .update({
        ...totais,
        total_colaboradores: totais.totalColaboradores,
        total_proventos: totais.totalProventos,
        total_descontos: totais.totalDescontos,
        total_liquido: totais.totalLiquido,
        total_fgts: totais.totalFGTS,
        total_inss_patronal: totais.totalINSSPatronal,
        custo_total: totais.custoTotal,
        updated_at: new Date().toISOString(),
      })
      .eq('id', folha_id)
      .select(FOLHA_FIELDS)
      .single();
    
    if (error) throw error;
    return data as FolhaPagamento;
  },

  // ==========================================
  // FECHAMENTO
  // ==========================================

  /**
   * Fecha folha de pagamento
   */
  async fecharFolha(folha_id: string): Promise<FolhaPagamento> {
    // Atualizar totais antes de fechar
    await this.atualizarTotaisFolha(folha_id);
    
    // Atualizar status
    return this.atualizarStatusFolha(folha_id, 'fechada');
  },

  /**
   * Reabre folha de pagamento
   */
  async reabrirFolha(folha_id: string): Promise<FolhaPagamento> {
    const { data: folha } = await supabase
      .from(TABLE_FOLHAS)
      .select('status')
      .eq('id', folha_id)
      .single();
    
    if (folha?.status === 'paga') {
      throw new Error('Não é possível reabrir folha já paga');
    }
    
    return this.atualizarStatusFolha(folha_id, 'aberta');
  },
};

export default folhaService;
