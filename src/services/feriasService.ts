/**
 * @fileoverview Service para operações de férias
 * @module services/feriasService
 * @version V8.1 - Corrigido por análise QA
 */
import { supabase } from '@/integrations/supabase/client';
import { Ferias, FeriasFormData, FeriasFilters, StatusFerias } from '@/types/ferias';
import { logger } from '@/lib/logger';
import { differenceInDays, differenceInMonths, addDays, isBefore, isAfter, parseISO } from 'date-fns';

// ============================================
// CONSTANTES
// ============================================

const TABLE_NAME = 'ferias';
const MAX_PERIODOS = 3;
const MIN_DIAS_PERIODO = 5;
const DIAS_DIREITO_ANUAL = 30;
const DIAS_ABONO_MAXIMO = 10;
const MESES_PERIODO_AQUISITIVO = 12;

const FERIAS_FIELDS = `
  id, colaborador_id, data_inicio, data_fim, dias, status, tipo,
  abono_pecuniario, dias_abono, valor_ferias, valor_abono, valor_terco,
  valor_total, observacoes, aprovador_id, data_aprovacao, data_pagamento,
  periodo_aquisitivo_inicio, periodo_aquisitivo_fim, empresa_id,
  created_at, updated_at
`;

const FERIAS_WITH_RELATIONS = `
  ${FERIAS_FIELDS},
  colaborador:colaboradores(id, nome, cpf, salario, data_admissao),
  aprovador:usuarios(id, nome)
`;

// ============================================
// TIPOS AUXILIARES
// ============================================

interface PeriodoAquisitivo {
  inicio: Date;
  fim: Date;
  diasDireito: number;
  diasUsados: number;
  diasRestantes: number;
  vencido: boolean;
  dataLimite: Date;
}

interface ValidacaoFerias {
  valido: boolean;
  erros: string[];
}

// ============================================
// FUNÇÕES DE CÁLCULO
// ============================================

/**
 * Calcula os períodos aquisitivos de férias
 */
function calcularPeriodosAquisitivos(dataAdmissao: Date, feriasUsadas: Ferias[]): PeriodoAquisitivo[] {
  const hoje = new Date();
  const periodos: PeriodoAquisitivo[] = [];
  let inicioPA = new Date(dataAdmissao);
  
  while (isBefore(inicioPA, hoje)) {
    const fimPA = addDays(addDays(inicioPA, 365), -1);
    const dataLimite = addDays(fimPA, 365); // 12 meses após término do PA
    
    // Calcular dias usados neste período
    const diasUsados = feriasUsadas
      .filter(f => {
        const inicioFerias = parseISO(f.data_inicio);
        return f.status !== 'cancelada' && 
               !isBefore(inicioFerias, inicioPA) && 
               !isAfter(inicioFerias, fimPA);
      })
      .reduce((acc, f) => acc + f.dias, 0);
    
    const diasRestantes = DIAS_DIREITO_ANUAL - diasUsados;
    const vencido = isAfter(hoje, dataLimite) && diasRestantes > 0;
    
    if (isBefore(fimPA, hoje)) {
      periodos.push({
        inicio: inicioPA,
        fim: fimPA,
        diasDireito: DIAS_DIREITO_ANUAL,
        diasUsados,
        diasRestantes: Math.max(0, diasRestantes),
        vencido,
        dataLimite,
      });
    }
    
    inicioPA = addDays(fimPA, 1);
  }
  
  return periodos;
}

/**
 * Valida solicitação de férias
 */
function validarSolicitacao(
  dados: FeriasFormData, 
  feriasExistentes: Ferias[],
  diasDisponiveis: number
): ValidacaoFerias {
  const erros: string[] = [];
  
  // Validar dias mínimos
  if (dados.dias < MIN_DIAS_PERIODO) {
    erros.push(`O período mínimo de férias é de ${MIN_DIAS_PERIODO} dias`);
  }
  
  // Validar dias disponíveis
  if (dados.dias > diasDisponiveis) {
    erros.push(`Dias solicitados (${dados.dias}) excedem dias disponíveis (${diasDisponiveis})`);
  }
  
  // Validar abono pecuniário
  if (dados.abono_pecuniario && dados.dias_abono) {
    if (dados.dias_abono > DIAS_ABONO_MAXIMO) {
      erros.push(`Abono pecuniário máximo é de ${DIAS_ABONO_MAXIMO} dias`);
    }
    if (dados.dias_abono > dados.dias / 3) {
      erros.push('Abono não pode exceder 1/3 do período de férias');
    }
  }
  
  // Validar sobreposição de períodos
  const dataInicio = parseISO(dados.data_inicio);
  const dataFim = parseISO(dados.data_fim);
  
  const sobreposicao = feriasExistentes.find(f => {
    if (f.status === 'cancelada') return false;
    const fInicio = parseISO(f.data_inicio);
    const fFim = parseISO(f.data_fim);
    return !(isAfter(dataInicio, fFim) || isBefore(dataFim, fInicio));
  });
  
  if (sobreposicao) {
    erros.push('Período solicitado sobrepõe férias já agendadas');
  }
  
  // Validar antecedência mínima (30 dias)
  const hoje = new Date();
  const diasAntecedencia = differenceInDays(dataInicio, hoje);
  if (diasAntecedencia < 30) {
    erros.push('Férias devem ser solicitadas com no mínimo 30 dias de antecedência');
  }
  
  return {
    valido: erros.length === 0,
    erros,
  };
}

// ============================================
// SERVICE
// ============================================

export const feriasService = {
  /**
   * Lista férias com filtros
   */
  async listar(filters?: FeriasFilters): Promise<Ferias[]> {
    try {
      let query = supabase
        .from(TABLE_NAME)
        .select(FERIAS_WITH_RELATIONS);
      
      if (filters?.empresa_id) {
        query = query.eq('empresa_id', filters.empresa_id);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.colaborador_id) {
        query = query.eq('colaborador_id', filters.colaborador_id);
      }
      if (filters?.ano) {
        query = query
          .gte('data_inicio', `${filters.ano}-01-01`)
          .lte('data_inicio', `${filters.ano}-12-31`);
      }
      if (filters?.dataInicio && filters?.dataFim) {
        query = query
          .gte('data_inicio', filters.dataInicio)
          .lte('data_fim', filters.dataFim);
      }
      
      const { data, error } = await query.order('data_inicio', { ascending: false });
      
      if (error) throw new Error(error.message);
      return (data ?? []) as Ferias[];
    } catch (error) {
      logger.error('Erro ao listar férias:', error);
      throw error;
    }
  },

  /**
   * Busca férias por ID
   */
  async buscarPorId(id: string): Promise<Ferias | null> {
    if (!id) throw new Error('ID é obrigatório');
    
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select(FERIAS_WITH_RELATIONS)
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(error.message);
      }
      return data as Ferias;
    } catch (error) {
      logger.error('Erro ao buscar férias por ID:', error);
      throw error;
    }
  },

  /**
   * Cria nova solicitação de férias
   */
  async criar(dados: FeriasFormData): Promise<Ferias> {
    try {
      // Buscar férias existentes do colaborador
      const feriasExistentes = await this.listar({ colaborador_id: dados.colaborador_id });
      
      // Calcular dias disponíveis
      const diasDisponiveis = await this.calcularDiasDisponiveis(dados.colaborador_id);
      
      // Validar
      const validacao = validarSolicitacao(dados, feriasExistentes, diasDisponiveis);
      if (!validacao.valido) {
        throw new Error(validacao.erros.join('; '));
      }
      
      // Calcular valores
      const { data: colaborador } = await supabase
        .from('colaboradores')
        .select('salario')
        .eq('id', dados.colaborador_id)
        .single();
      
      const salario = colaborador?.salario || 0;
      const valorDia = salario / 30;
      const valorFerias = valorDia * dados.dias;
      const valorAbono = dados.abono_pecuniario ? valorDia * (dados.dias_abono || 0) : 0;
      const valorTerco = (valorFerias + valorAbono) / 3;
      const valorTotal = valorFerias + valorAbono + valorTerco;
      
      const novasFerias = {
        ...dados,
        status: 'solicitada' as StatusFerias,
        valor_ferias: valorFerias,
        valor_abono: valorAbono,
        valor_terco: valorTerco,
        valor_total: valorTotal,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([novasFerias])
        .select(FERIAS_FIELDS)
        .single();
      
      if (error) throw new Error(error.message);
      
      logger.info('Férias criadas:', { id: data.id, colaborador_id: dados.colaborador_id });
      return data as Ferias;
    } catch (error) {
      logger.error('Erro ao criar férias:', error);
      throw error;
    }
  },

  /**
   * Atualiza férias
   */
  async atualizar(id: string, dados: Partial<FeriasFormData>): Promise<Ferias> {
    if (!id) throw new Error('ID é obrigatório');
    
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update({
          ...dados,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select(FERIAS_FIELDS)
        .single();
      
      if (error) throw new Error(error.message);
      return data as Ferias;
    } catch (error) {
      logger.error('Erro ao atualizar férias:', error);
      throw error;
    }
  },

  /**
   * Aprova férias
   */
  async aprovar(id: string, aprovadorId: string): Promise<Ferias> {
    try {
      return await this.atualizar(id, {
        status: 'aprovada',
        aprovador_id: aprovadorId,
        data_aprovacao: new Date().toISOString(),
      } as Partial<FeriasFormData>);
    } catch (error) {
      logger.error('Erro ao aprovar férias:', error);
      throw error;
    }
  },

  /**
   * Rejeita férias
   */
  async rejeitar(id: string, motivo: string): Promise<Ferias> {
    try {
      return await this.atualizar(id, {
        status: 'rejeitada',
        observacoes: motivo,
      } as Partial<FeriasFormData>);
    } catch (error) {
      logger.error('Erro ao rejeitar férias:', error);
      throw error;
    }
  },

  /**
   * Cancela férias
   */
  async cancelar(id: string, motivo?: string): Promise<Ferias> {
    try {
      const ferias = await this.buscarPorId(id);
      if (!ferias) throw new Error('Férias não encontradas');
      
      if (ferias.status === 'em_gozo') {
        throw new Error('Não é possível cancelar férias em gozo');
      }
      
      return await this.atualizar(id, {
        status: 'cancelada',
        observacoes: motivo || 'Cancelado pelo usuário',
      } as Partial<FeriasFormData>);
    } catch (error) {
      logger.error('Erro ao cancelar férias:', error);
      throw error;
    }
  },

  /**
   * Calcula dias disponíveis de férias
   */
  async calcularDiasDisponiveis(colaboradorId: string): Promise<number> {
    try {
      // Buscar dados do colaborador
      const { data: colaborador, error: colabError } = await supabase
        .from('colaboradores')
        .select('data_admissao, status')
        .eq('id', colaboradorId)
        .single();
      
      if (colabError || !colaborador?.data_admissao) {
        throw new Error('Colaborador não encontrado ou sem data de admissão');
      }
      
      if (colaborador.status !== 'ativo') {
        return 0;
      }
      
      const dataAdmissao = parseISO(colaborador.data_admissao);
      const hoje = new Date();
      const mesesTrabalhados = differenceInMonths(hoje, dataAdmissao);
      
      // Precisa de 12 meses para ter direito a férias
      if (mesesTrabalhados < MESES_PERIODO_AQUISITIVO) {
        return 0;
      }
      
      // Buscar férias já tiradas
      const feriasUsadas = await this.listar({ 
        colaborador_id: colaboradorId,
        status: 'concluida',
      });
      
      // Calcular períodos aquisitivos
      const periodos = calcularPeriodosAquisitivos(dataAdmissao, feriasUsadas);
      
      // Somar dias restantes de todos os períodos
      return periodos.reduce((acc, p) => acc + p.diasRestantes, 0);
    } catch (error) {
      logger.error('Erro ao calcular dias disponíveis:', error);
      throw error;
    }
  },

  /**
   * Busca períodos aquisitivos do colaborador
   */
  async buscarPeriodosAquisitivos(colaboradorId: string): Promise<PeriodoAquisitivo[]> {
    try {
      const { data: colaborador } = await supabase
        .from('colaboradores')
        .select('data_admissao')
        .eq('id', colaboradorId)
        .single();
      
      if (!colaborador?.data_admissao) return [];
      
      const feriasUsadas = await this.listar({ colaborador_id: colaboradorId });
      return calcularPeriodosAquisitivos(parseISO(colaborador.data_admissao), feriasUsadas);
    } catch (error) {
      logger.error('Erro ao buscar períodos aquisitivos:', error);
      throw error;
    }
  },

  /**
   * Lista férias vencidas (não gozadas após 12 meses do período aquisitivo)
   */
  async listarFeriasVencidas(empresaId?: string): Promise<Array<{ colaboradorId: string; diasVencidos: number; dataLimite: Date }>> {
    try {
      let query = supabase
        .from('colaboradores')
        .select('id, data_admissao')
        .eq('status', 'ativo');
      
      if (empresaId) {
        query = query.eq('empresa_id', empresaId);
      }
      
      const { data: colaboradores } = await query;
      if (!colaboradores) return [];
      
      const resultado: Array<{ colaboradorId: string; diasVencidos: number; dataLimite: Date }> = [];
      
      for (const colab of colaboradores) {
        if (!colab.data_admissao) continue;
        
        const feriasUsadas = await this.listar({ colaborador_id: colab.id });
        const periodos = calcularPeriodosAquisitivos(parseISO(colab.data_admissao), feriasUsadas);
        
        for (const periodo of periodos) {
          if (periodo.vencido && periodo.diasRestantes > 0) {
            resultado.push({
              colaboradorId: colab.id,
              diasVencidos: periodo.diasRestantes,
              dataLimite: periodo.dataLimite,
            });
          }
        }
      }
      
      return resultado;
    } catch (error) {
      logger.error('Erro ao listar férias vencidas:', error);
      throw error;
    }
  },
};

export default feriasService;
