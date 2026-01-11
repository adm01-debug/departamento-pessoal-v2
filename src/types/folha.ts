// V15-161: src/types/folha.ts
export interface FolhaPagamento {
  id: string;
  empresa_id: string;
  competencia: string;
  tipo: TipoFolha;
  status: StatusFolha;
  data_calculo?: string;
  data_fechamento?: string;
  total_proventos: number;
  total_descontos: number;
  total_liquido: number;
  total_encargos: number;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface ItemFolha {
  id: string;
  folha_id: string;
  colaborador_id: string;
  colaborador_nome?: string;
  salario_base: number;
  dias_trabalhados: number;
  horas_extras_50: number;
  horas_extras_100: number;
  adicional_noturno: number;
  adicional_periculosidade: number;
  adicional_insalubridade: number;
  comissoes: number;
  outros_proventos: number;
  total_proventos: number;
  inss: number;
  irrf: number;
  vale_transporte: number;
  vale_refeicao: number;
  plano_saude: number;
  emprestimo_consignado: number;
  pensao_alimenticia: number;
  outros_descontos: number;
  total_descontos: number;
  valor_liquido: number;
  fgts: number;
  inss_patronal: number;
}

export type TipoFolha = 'mensal' | 'adiantamento' | 'ferias' | '13_primeira' | '13_segunda' | 'rescisao' | 'plr';
export type StatusFolha = 'rascunho' | 'calculada' | 'conferida' | 'fechada' | 'paga';

export interface FolhaFilters {
  competencia?: string;
  tipo?: TipoFolha;
  status?: StatusFolha;
}
