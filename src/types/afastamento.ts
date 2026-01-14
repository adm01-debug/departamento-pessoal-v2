// V16: src/types/afastamento.ts
export interface Afastamento {
  id: string;
  colaborador_id: string;
  colaborador_nome?: string;
  tipo: TipoAfastamento;
  motivo?: string;
  cid?: string | null;
  cid_descricao?: string | null;
  data_inicio: string;
  data_fim_prevista: string;
  data_fim_real?: string | null;
  dias_total?: number | null;
  dias_empresa?: number | null;
  dias_inss?: number | null;
  medico_nome?: string | null;
  medico_crm?: string | null;
  atestado_numero?: string | null;
  numero_beneficio?: string | null;
  data_pericia?: string | null;
  documento_url?: string;
  inss?: boolean;
  observacoes?: string | null;
  empresa_id?: string | null;
  status: StatusAfastamento | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

export type TipoAfastamento =
  | 'doenca'
  | 'acidente_trabalho'
  | 'acidente_trajeto'
  | 'licenca_maternidade'
  | 'licenca_paternidade'
  | 'licenca_casamento'
  | 'licenca_obito'
  | 'licenca_nao_remunerada'
  | 'servico_militar'
  | 'mandato_sindical'
  | 'outros';

export type StatusAfastamento = 'ativo' | 'encerrado' | 'prorrogado' | 'cancelado';

export interface AfastamentoComColaborador extends Afastamento {
  colaborador_nome?: string;
  colaborador_cargo?: string;
  colaborador_departamento?: string;
  colaborador_salario?: number;
}

export interface ConfigAfastamento {
  id: string;
  colaborador_id?: string;
  tipo: TipoAfastamento;
  data_inicio?: string;
  data_fim?: string;
  status?: string;
  motivo?: string;
  descricao?: string | null;
  dias_minimos?: number | null;
  dias_maximos?: number | null;
  dias_empresa_maximo?: number | null;
  pago_empresa?: boolean | null;
  pago_inss?: boolean | null;
  created_at?: string;
}

export interface AfastamentoFormData extends Omit<Afastamento, 'id' | 'created_at' | 'updated_at' | 'colaborador_nome' | 'dias_total'> {}
