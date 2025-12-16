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
  | 'suspensao_disciplinar'
  | 'outros';

export type StatusAfastamento = 'ativo' | 'encerrado' | 'cancelado' | 'prorrogado';

export interface Afastamento {
  id: string;
  colaborador_id: string;
  tipo: TipoAfastamento;
  data_inicio: string;
  data_fim_prevista: string;
  data_fim_real: string | null;
  dias_empresa: number;
  dias_inss: number;
  dias_total: number;
  cid: string | null;
  cid_descricao: string | null;
  numero_beneficio: string | null;
  data_pericia: string | null;
  medico_nome: string | null;
  medico_crm: string | null;
  atestado_numero: string | null;
  observacoes: string | null;
  status: StatusAfastamento;
  created_at: string;
  created_by: string | null;
  updated_at: string;
}

export interface AfastamentoComColaborador extends Afastamento {
  colaborador_nome?: string;
  colaborador_cargo?: string;
  colaborador_departamento?: string;
}

export interface ProrrogacaoAfastamento {
  id: string;
  afastamento_id: string;
  data_fim_anterior: string;
  data_fim_nova: string;
  dias_adicionais: number;
  motivo: string | null;
  numero_beneficio_novo: string | null;
  data_pericia: string | null;
  created_at: string;
  created_by: string | null;
}

export interface ConfigAfastamento {
  id: string;
  tipo: TipoAfastamento;
  dias_empresa_maximo: number;
  dias_minimos: number;
  dias_maximos: number | null;
  pago_empresa: boolean;
  pago_inss: boolean;
  descricao: string | null;
  created_at: string;
}

export const tipoAfastamentoLabels: Record<TipoAfastamento, string> = {
  doenca: 'Doença',
  acidente_trabalho: 'Acidente de Trabalho',
  acidente_trajeto: 'Acidente de Trajeto',
  licenca_maternidade: 'Licença Maternidade',
  licenca_paternidade: 'Licença Paternidade',
  licenca_casamento: 'Licença Casamento',
  licenca_obito: 'Licença Óbito',
  licenca_nao_remunerada: 'Licença Não Remunerada',
  servico_militar: 'Serviço Militar',
  mandato_sindical: 'Mandato Sindical',
  suspensao_disciplinar: 'Suspensão Disciplinar',
  outros: 'Outros'
};

export const tipoAfastamentoIcons: Record<TipoAfastamento, string> = {
  doenca: '🏥',
  acidente_trabalho: '⚠️',
  acidente_trajeto: '🚗',
  licenca_maternidade: '👶',
  licenca_paternidade: '👨‍👶',
  licenca_casamento: '💒',
  licenca_obito: '🕯️',
  licenca_nao_remunerada: '📋',
  servico_militar: '🎖️',
  mandato_sindical: '🏛️',
  suspensao_disciplinar: '⛔',
  outros: '📄'
};

export const statusAfastamentoLabels: Record<StatusAfastamento, string> = {
  ativo: 'Ativo',
  encerrado: 'Encerrado',
  cancelado: 'Cancelado',
  prorrogado: 'Prorrogado'
};

export const statusAfastamentoColors: Record<StatusAfastamento, { bg: string; text: string }> = {
  ativo: { bg: 'bg-warning/10', text: 'text-warning' },
  encerrado: { bg: 'bg-success/10', text: 'text-success' },
  cancelado: { bg: 'bg-destructive/10', text: 'text-destructive' },
  prorrogado: { bg: 'bg-info/10', text: 'text-info' }
};
