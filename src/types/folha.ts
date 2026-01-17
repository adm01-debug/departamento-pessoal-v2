// V18: Tipos de Folha de Pagamento - Formatado e Documentado

/**
 * Tipos de folha de pagamento
 */
export type TipoFolha = 
  | 'mensal' 
  | 'adiantamento' 
  | 'ferias' 
  | '13_primeira' 
  | '13_segunda' 
  | 'rescisao' 
  | 'plr';

/**
 * Status da folha de pagamento
 */
export type StatusFolha = 
  | 'rascunho' 
  | 'calculada' 
  | 'conferida' 
  | 'fechada' 
  | 'paga';

/**
 * Interface principal da Folha de Pagamento
 */
export interface FolhaPagamento {
  id: string;
  empresa_id: string;
  competencia: string;
  tipo: TipoFolha;
  status: StatusFolha;
  
  // Totais
  total_proventos: number;
  total_descontos: number;
  total_liquido: number;
  total_fgts: number;
  total_inss_empresa?: number;
  
  // Datas
  data_calculo?: string;
  data_fechamento?: string;
  data_pagamento?: string;
  created_at: string;
  updated_at?: string;
  
  // Contagem
  total_colaboradores?: number;
}

/**
 * Item individual da folha (um colaborador)
 */
export interface ItemFolha {
  id: string;
  folha_id: string;
  colaborador_id: string;
  colaborador_nome: string;
  
  // Base
  salario_base: number;
  
  // Proventos
  total_proventos: number;
  horas_extras_50?: number;
  horas_extras_100?: number;
  adicional_noturno?: number;
  adicional_periculosidade?: number;
  adicional_insalubridade?: number;
  comissoes?: number;
  gratificacoes?: number;
  
  // Descontos
  total_descontos: number;
  inss: number;
  irrf: number;
  vale_transporte?: number;
  vale_refeicao?: number;
  plano_saude?: number;
  pensao_alimenticia?: number;
  outros_descontos?: number;
  
  // Encargos
  fgts: number;
  
  // Líquido
  valor_liquido: number;
  
  // Dependentes
  dependentes_irrf?: number;
  salario_familia?: number;
}

/**
 * Filtros para listagem de folhas
 */
export interface FolhaFilters {
  competencia?: string;
  tipo?: TipoFolha;
  status?: StatusFolha;
  empresa_id?: string;
}

/**
 * Resumo da folha para dashboard
 */
export interface FolhaResumo {
  competencia: string;
  status: StatusFolha;
  total_colaboradores: number;
  total_liquido: number;
  total_fgts: number;
}

/**
 * Dados para geração de holerite
 */
export interface Holerite extends ItemFolha {
  empresa_nome: string;
  empresa_cnpj: string;
  competencia: string;
  data_pagamento?: string;
}
