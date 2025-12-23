export type EventoESocialTipo = 
  | 'S-1000' | 'S-1005' | 'S-1010' | 'S-1020' | 'S-1030' | 'S-1035'
  | 'S-1040' | 'S-1050' | 'S-1060' | 'S-1070' | 'S-1080'
  | 'S-2190' | 'S-2200' | 'S-2205' | 'S-2206' | 'S-2210' | 'S-2220'
  | 'S-2230' | 'S-2231' | 'S-2240' | 'S-2250' | 'S-2298' | 'S-2299'
  | 'S-2300' | 'S-2306' | 'S-2399' | 'S-2400' | 'S-2405' | 'S-2410'
  | 'S-3000';

export interface EventoESocial {
  id: string;
  tipo: EventoESocialTipo;
  descricao: string;
  status: 'pendente' | 'enviado' | 'processando' | 'aceito' | 'rejeitado' | 'erro';
  xml?: string;
  recibo?: string;
  protocolo?: string;
  colaborador_id?: string;
  empresa_id: string;
  data_evento: string;
  data_envio?: string;
  data_retorno?: string;
  erro_mensagem?: string;
  erro_codigo?: string;
  created_at: string;
  updated_at?: string;
}

export interface EventoESocialFilters {
  tipo?: EventoESocialTipo;
  status?: EventoESocial['status'];
  colaborador_id?: string;
  empresa_id?: string;
  data_inicio?: string;
  data_fim?: string;
}

export interface LoteESocial {
  id: string;
  eventos: EventoESocial[];
  status: 'aguardando' | 'enviando' | 'processando' | 'finalizado' | 'erro';
  protocolo?: string;
  data_envio?: string;
  empresa_id: string;
}

export const EVENTOS_ESOCIAL_DESCRICAO: Record<EventoESocialTipo, string> = {
  'S-1000': 'Informações do Empregador',
  'S-1005': 'Tabela de Estabelecimentos',
  'S-1010': 'Tabela de Rubricas',
  'S-1020': 'Tabela de Lotações Tributárias',
  'S-1030': 'Tabela de Cargos',
  'S-1035': 'Tabela de Carreiras Públicas',
  'S-1040': 'Tabela de Funções',
  'S-1050': 'Tabela de Horários',
  'S-1060': 'Tabela de Ambientes de Trabalho',
  'S-1070': 'Tabela de Processos',
  'S-1080': 'Tabela de Operadores Portuários',
  'S-2190': 'Registro Preliminar de Trabalhador',
  'S-2200': 'Cadastramento Inicial / Admissão',
  'S-2205': 'Alteração de Dados Cadastrais',
  'S-2206': 'Alteração de Contrato',
  'S-2210': 'Comunicação de Acidente de Trabalho',
  'S-2220': 'Monitoramento da Saúde',
  'S-2230': 'Afastamento Temporário',
  'S-2231': 'Cessão/Exercício em Outro Órgão',
  'S-2240': 'Condições Ambientais do Trabalho',
  'S-2250': 'Aviso Prévio',
  'S-2298': 'Reintegração',
  'S-2299': 'Desligamento',
  'S-2300': 'TSV - Início',
  'S-2306': 'TSV - Alteração Contratual',
  'S-2399': 'TSV - Término',
  'S-2400': 'Cadastro de Benefícios',
  'S-2405': 'Alteração de Dados de Benefício',
  'S-2410': 'Cessação de Benefício',
  'S-3000': 'Exclusão de Eventos',
};

