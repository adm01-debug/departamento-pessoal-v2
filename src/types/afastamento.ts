// V15-167: src/types/afastamento.ts
export interface Afastamento {
  id: string;
  colaborador_id: string;
  colaborador_nome?: string;
  tipo: TipoAfastamento;
  motivo: string;
  cid?: string;
  data_inicio: string;
  data_fim?: string;
  data_prevista_retorno?: string;
  dias_afastamento?: number;
  documento_url?: string;
  medico_nome?: string;
  medico_crm?: string;
  inss: boolean;
  numero_beneficio_inss?: string;
  observacoes?: string;
  status: StatusAfastamento;
  created_at: string;
  updated_at: string;
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

export type StatusAfastamento = 'ativo' | 'encerrado' | 'prorrogado';

export interface AfastamentoFormData extends Omit<Afastamento, 'id' | 'created_at' | 'updated_at' | 'colaborador_nome' | 'dias_afastamento'> {}
