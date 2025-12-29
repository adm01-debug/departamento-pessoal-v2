/**
 * @fileoverview Tipos para folha de pagamento
 * @module types/folha
 * @version V8.1 - Corrigido por análise QA
 */

// ============================================
// TIPOS DE TABELAS DE CÁLCULO
// ============================================

/**
 * Estrutura de faixa da tabela INSS
 */
export interface TabelaINSS {
  faixa: number;
  valorInicial: number;
  valorFinal: number;
  aliquota: number;
}

/**
 * Estrutura de faixa da tabela IRRF
 */
export interface TabelaIRRF {
  faixa: number;
  valorInicial: number;
  valorFinal: number;
  aliquota: number;
  deducao: number;
}

/**
 * Resultado do cálculo de INSS
 */
export interface ResultadoCalculoINSS {
  baseCalculo: number;
  aliquotaEfetiva: number;
  valorINSS: number;
  detalhamento: Array<{
    faixa: number;
    base: number;
    aliquota: number;
    valor: number;
  }>;
}

/**
 * Resultado do cálculo de IRRF
 */
export interface ResultadoCalculoIRRF {
  baseCalculo: number;
  aliquota: number;
  deducao: number;
  valorIRRF: number;
  faixa?: number;
}

// ============================================
// TIPOS DE HOLERITE
// ============================================

/**
 * Holerite do colaborador
 */
export interface Holerite {
  id: string;
  colaborador_id: string;
  colaborador_nome?: string;
  colaborador_cpf?: string;
  competencia: string;
  mes: number;
  ano: number;
  salario_base: number;
  total_proventos: number;
  total_descontos: number;
  salario_liquido: number;
  inss: number;
  irrf: number;
  fgts: number;
  inss_patronal?: number;
  horas_extras_50?: number;
  horas_extras_100?: number;
  adicional_noturno?: number;
  comissoes?: number;
  dsr?: number;
  gratificacoes?: number;
  descontos_vt?: number;
  descontos_vr?: number;
  descontos_plano_saude?: number;
  descontos_pensao?: number;
  outros_proventos?: number;
  outros_descontos?: number;
  empresa_id: string;
  status: StatusHolerite;
  created_at?: string;
  updated_at?: string;
}

export type StatusHolerite = 'rascunho' | 'calculado' | 'conferido' | 'aprovado' | 'pago';

/**
 * Detalhamento de rubrica no holerite
 */
export interface RubricaHolerite {
  id: string;
  holerite_id: string;
  rubrica_id: string;
  codigo: string;
  descricao: string;
  tipo: 'provento' | 'desconto';
  referencia?: string;
  valor: number;
  incide_inss: boolean;
  incide_irrf: boolean;
  incide_fgts: boolean;
}

// ============================================
// TIPOS DE FOLHA DE PAGAMENTO
// ============================================

export type StatusFolha = 'aberta' | 'calculando' | 'calculada' | 'conferida' | 'fechada' | 'paga';

/**
 * Folha de pagamento mensal
 */
export interface FolhaPagamento {
  id: string;
  competencia: string;
  mes: number;
  ano: number;
  empresa_id: string;
  status: StatusFolha;
  data_abertura?: string;
  data_calculo?: string;
  data_fechamento?: string;
  data_pagamento?: string;
  total_colaboradores: number;
  total_proventos: number;
  total_descontos: number;
  total_liquido: number;
  total_fgts: number;
  total_inss_patronal: number;
  custo_total: number;
  observacoes?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

/**
 * Lançamento variável na folha
 */
export interface LancamentoFolha {
  id: string;
  folha_id: string;
  colaborador_id: string;
  rubrica_id: string;
  tipo: 'provento' | 'desconto';
  referencia?: string;
  valor: number;
  observacao?: string;
  created_at?: string;
}

/**
 * Evento variável (horas extras, faltas, etc.)
 */
export interface EventoVariavel {
  id: string;
  colaborador_id: string;
  competencia: string;
  tipo: TipoEventoVariavel;
  quantidade: number;
  valor?: number;
  data_evento?: string;
  observacao?: string;
  aprovado: boolean;
  aprovado_por?: string;
  created_at?: string;
}

export type TipoEventoVariavel = 
  | 'hora_extra_50'
  | 'hora_extra_100'
  | 'adicional_noturno'
  | 'falta'
  | 'atraso'
  | 'atestado'
  | 'comissao'
  | 'bonus'
  | 'desconto';

// ============================================
// TIPOS DE RUBRICAS
// ============================================

/**
 * Rubrica da folha de pagamento
 */
export interface RubricaFolha {
  id: string;
  codigo: string;
  descricao: string;
  tipo: 'provento' | 'desconto';
  natureza: NaturezaRubrica;
  incide_inss: boolean;
  incide_irrf: boolean;
  incide_fgts: boolean;
  incide_dsr: boolean;
  formula?: string;
  ativa: boolean;
  esocial_codigo?: string;
  esocial_descricao?: string;
  created_at?: string;
  updated_at?: string;
}

export type NaturezaRubrica = 
  | 'salario'
  | 'hora_extra'
  | 'adicional'
  | 'comissao'
  | 'gratificacao'
  | 'ferias'
  | '13_salario'
  | 'rescisao'
  | 'desconto_legal'
  | 'desconto_autorizado'
  | 'beneficio';

// ============================================
// FILTROS
// ============================================

export interface FolhaFilters {
  competencia?: string;
  mes?: number;
  ano?: number;
  empresa_id?: string;
  status?: StatusFolha;
  colaborador_id?: string;
}

export interface HoleriteFilters {
  competencia?: string;
  mes?: number;
  ano?: number;
  empresa_id?: string;
  colaborador_id?: string;
  departamento_id?: string;
  status?: StatusHolerite;
}

// ============================================
// TOTALIZADORES
// ============================================

export interface TotaisFolha {
  totalColaboradores: number;
  totalProventos: number;
  totalDescontos: number;
  totalLiquido: number;
  totalINSS: number;
  totalIRRF: number;
  totalFGTS: number;
  totalINSSPatronal: number;
  custoTotal: number;
}

export interface ResumoFolha extends TotaisFolha {
  competencia: string;
  empresa_id: string;
  status: StatusFolha;
  porDepartamento?: Array<{
    departamento_id: string;
    departamento_nome: string;
    totais: TotaisFolha;
  }>;
}
