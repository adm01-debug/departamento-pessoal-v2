// V15-164: src/types/beneficio.ts
export interface Beneficio {
  id: string;
  empresa_id: string;
  nome: string;
  tipo: TipoBeneficio;
  descricao?: string;
  valor_empresa: number;
  valor_colaborador: number;
  tipo_desconto: TipoDesconto;
  percentual_desconto?: number;
  valor_fixo_desconto?: number;
  fornecedor?: string;
  contrato?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface BeneficioColaborador {
  id: string;
  beneficio_id: string;
  colaborador_id: string;
  beneficio_nome?: string;
  valor_empresa: number;
  valor_colaborador: number;
  data_inicio: string;
  data_fim?: string;
  numero_cartao?: string;
  dependentes?: number;
  observacao?: string;
  ativo: boolean;
  created_at: string;
}

export type TipoBeneficio = 
  | 'vale_transporte'
  | 'vale_refeicao'
  | 'vale_alimentacao'
  | 'plano_saude'
  | 'plano_odontologico'
  | 'seguro_vida'
  | 'previdencia_privada'
  | 'auxilio_creche'
  | 'auxilio_educacao'
  | 'gympass'
  | 'outros';

export type TipoDesconto = 'percentual' | 'fixo' | 'sem_desconto';

export interface BeneficioFormData extends Omit<Beneficio, 'id' | 'created_at' | 'updated_at'> {}

export interface AtribuirBeneficioData {
  beneficio_id: string;
  colaborador_ids: string[];
  data_inicio: string;
}
