export interface Holerite {
  id: string;
  colaborador_id: string;
  mes: number;
  ano: number;
  salario_base: number;
  total_proventos: number;
  total_descontos: number;
  salario_liquido: number;
  inss?: number;
  irrf?: number;
  fgts?: number;
  horas_extras_valor?: number;
  descontos_vt?: number;
  descontos_vr?: number;
  outros_proventos?: number;
  outros_descontos?: number;
  empresa_id: string;
  created_at?: string;
}

export interface FolhaPagamento {
  id: string;
  mes: number;
  ano: number;
  empresa_id: string;
  status: 'aberta' | 'calculada' | 'fechada';
  data_fechamento?: string;
  total_proventos: number;
  total_descontos: number;
  total_liquido: number;
  total_colaboradores: number;
}

export interface RubricaFolha {
  id: string;
  codigo: string;
  descricao: string;
  tipo: 'provento' | 'desconto';
  incide_inss: boolean;
  incide_irrf: boolean;
  incide_fgts: boolean;
}

export interface FolhaFilters {
  mes?: number;
  ano?: number;
  empresa_id?: string;
  status?: FolhaPagamento['status'];
}
