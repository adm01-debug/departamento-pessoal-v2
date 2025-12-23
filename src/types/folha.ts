// Tipos para o módulo de Folha de Pagamento

export type TipoEventoFolha = 'provento' | 'desconto' | 'informativo';
export type StatusFolha = 'aberta' | 'calculada' | 'fechada' | 'paga';

export interface RubricaFolha {
  id: string;
  codigo: string;
  descricao: string;
  tipo: TipoEventoFolha;
  incide_inss: boolean;
  incide_irrf: boolean;
  incide_fgts: boolean;
  automatico: boolean;
  formula?: string;
  ativo: boolean;
  created_at: string;
}

export interface FolhaPagamento {
  id: string;
  competencia: string;
  tipo: string;
  status: StatusFolha;
  data_calculo?: string;
  data_fechamento?: string;
  data_pagamento?: string;
  total_proventos: number;
  total_descontos: number;
  total_liquido: number;
  total_fgts: number;
  total_inss_patronal: number;
  total_colaboradores: number;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface Holerite {
  id: string;
  folha_id: string;
  colaborador_id: string;
  colaborador_nome: string;
  colaborador_cpf: string;
  colaborador_cargo: string;
  colaborador_departamento: string;
  colaborador_matricula?: string;
  salario_base: number;
  total_proventos: number;
  total_descontos: number;
  liquido: number;
  base_inss: number;
  base_irrf: number;
  base_fgts: number;
  valor_inss: number;
  valor_irrf: number;
  valor_fgts: number;
  dependentes_irrf: number;
  faltas_dias: number;
  horas_extras_50: number;
  horas_extras_100: number;
  created_at: string;
}

export interface LancamentoFolha {
  id: string;
  holerite_id: string;
  rubrica_id: string;
  rubrica_codigo: string;
  rubrica_descricao: string;
  tipo: TipoEventoFolha;
  referencia?: number;
  valor: number;
  automatico: boolean;
  created_at: string;
}

export interface EventoVariavel {
  id: string;
  competencia: string;
  colaborador_id: string;
  rubrica_id: string;
  referencia?: number;
  valor: number;
  observacao?: string;
  created_at: string;
  created_by?: string;
  // Joined data
  rubrica?: RubricaFolha;
}

export interface ParametroFiscal {
  id: string;
  tipo: string;
  vigencia_inicio: string;
  vigencia_fim?: string;
  faixa?: number;
  valor_inicial?: number;
  valor_final?: number;
  aliquota?: number;
  deducao?: number;
  valor_fixo?: number;
  ativo: boolean;
  created_at: string;
}

// Tipos auxiliares para cálculos
export interface TabelaINSS {
  faixa: number;
  valorInicial: number;
  valorFinal: number;
  aliquota: number;
}

export interface TabelaIRRF {
  faixa: number;
  valorInicial: number;
  valorFinal: number;
  aliquota: number;
  deducao: number;
}

export interface ResultadoCalculoINSS {
  baseCalculo: number;
  aliquotaEfetiva: number;
  valorINSS: number;
  detalhamento: { faixa: number; base: number; aliquota: number; valor: number }[];
}

export interface ResultadoCalculoIRRF {
  baseCalculo: number;
  aliquota: number;
  deducao: number;
  valorIRRF: number;
}

export interface ResumoFolha {
  totalProventos: number;
  totalDescontos: number;
  totalLiquido: number;
  totalFGTS: number;
  totalINSSPatronal: number;
  totalColaboradores: number;
}

// Labels
export const statusFolhaLabels: Record<StatusFolha, string> = {
  aberta: 'Aberta',
  calculada: 'Calculada',
  fechada: 'Fechada',
  paga: 'Paga',
};

export const statusFolhaColors: Record<StatusFolha, { bg: string; text: string }> = {
  aberta: { bg: 'bg-info/10', text: 'text-info' },
  calculada: { bg: 'bg-warning/10', text: 'text-warning' },
  fechada: { bg: 'bg-primary/10', text: 'text-primary' },
  paga: { bg: 'bg-success/10', text: 'text-success' },
};

export const tipoEventoLabels: Record<TipoEventoFolha, string> = {
  provento: 'Provento',
  desconto: 'Desconto',
  informativo: 'Informativo',
};

export const tipoFolhaLabels: Record<string, string> = {
  mensal: 'Mensal',
  '13_1_parcela': '13º - 1ª Parcela',
  '13_2_parcela': '13º - 2ª Parcela',
  ferias: 'Férias',
  rescisao: 'Rescisão',
};

// Helpers
export function formatCompetencia(competencia: string): string {
  const [ano, mes] = competencia.split('-');
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${meses[parseInt(mes) - 1]}/${ano}`;
}

export function formatCompetenciaFull(competencia: string): string {
  const [ano, mes] = competencia.split('-');
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  return `${meses[parseInt(mes) - 1]} de ${ano}`;
}

export function getCompetenciaAtual(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function getProximaCompetencia(competencia: string): string {
  const [ano, mes] = competencia.split('-').map(Number);
  if (mes === 12) {
    return `${ano + 1}-01`;
  }
  return `${ano}-${String(mes + 1).padStart(2, '0')}`;
}

