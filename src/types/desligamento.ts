/**
 * @fileoverview Tipos para processo de desligamento
 * @module types/desligamento
 * @version V8.2 - QA Fix - Corrigido typo e adicionados tipos
 */

// ============================================
// TIPOS DE DESLIGAMENTO
// ============================================

export type TipoDesligamento = 
  | 'sem_justa_causa'
  | 'com_justa_causa'
  | 'pedido_demissao'
  | 'acordo_mutuo'
  | 'culpa_reciproca'
  | 'fim_contrato'
  | 'aposentadoria'
  | 'falecimento';

export type StatusDesligamento = 
  | 'iniciado'
  | 'em_andamento'
  | 'aguardando_homologacao'
  | 'homologado'
  | 'concluido'
  | 'cancelado';

// ============================================
// CÁLCULO DE RESCISÃO
// ============================================

export interface CalculoRescisao {
  // Proventos
  saldoSalario: number;
  avisoPrevio: number;  // CORRIGIDO: era avisoPrevoio
  feriasVencidas: number;
  feriasProporcionais: number;
  tercoConstitucional: number;
  decimoTerceiro: number;
  
  // FGTS
  fgts: number;
  multaFgts: number;
  saqueFgts: number;
  
  // Descontos
  inss: number;
  irrf: number;
  avisoDesconto: number;
  outrosDescontos: number;
  
  // Totais
  totalProventos: number;
  totalDescontos: number;
  valorLiquido: number;
}

// ============================================
// INTERFACE PRINCIPAL
// ============================================

export interface Desligamento {
  id: string;
  colaborador_id: string;
  empresa_id?: string;
  
  // Dados do desligamento
  tipo: TipoDesligamento;
  status: StatusDesligamento;
  data_desligamento: string;
  data_aviso_previo?: string;
  aviso_previo_trabalhado: boolean;
  dias_aviso_previo: number;
  motivo_detalhado?: string;
  
  // Cálculos
  calculo?: CalculoRescisao;
  
  // Checklist
  checklist_comunicacao: boolean;
  checklist_documentacao: boolean;
  checklist_calculo_rescisao: boolean;
  checklist_homologacao: boolean;
  checklist_revogacao_acessos: boolean;
  checklist_devolucao_equipamentos: boolean;
  checklist_esocial: boolean;
  checklist_pagamento: boolean;
  
  // Entrevista de desligamento
  entrevista_realizada: boolean;
  entrevista_observacoes?: string;
  
  // Documentos
  documentos_gerados: string[];
  
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// FORMULÁRIO
// ============================================

export interface DesligamentoFormData {
  colaborador_id: string;
  tipo: TipoDesligamento;
  data_desligamento: string;
  data_aviso_previo?: string;
  aviso_previo_trabalhado: boolean;
  motivo_detalhado?: string;
}

// ============================================
// LABELS
// ============================================

export const tipoDesligamentoLabels: Record<TipoDesligamento, string> = {
  sem_justa_causa: 'Dispensa sem Justa Causa',
  com_justa_causa: 'Dispensa por Justa Causa',
  pedido_demissao: 'Pedido de Demissão',
  acordo_mutuo: 'Acordo Mútuo (Art. 484-A)',
  culpa_reciproca: 'Culpa Recíproca',
  fim_contrato: 'Fim de Contrato',
  aposentadoria: 'Aposentadoria',
  falecimento: 'Falecimento',
};

export const statusDesligamentoLabels: Record<StatusDesligamento, string> = {
  iniciado: 'Iniciado',
  em_andamento: 'Em Andamento',
  aguardando_homologacao: 'Aguardando Homologação',
  homologado: 'Homologado',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
};

// ============================================
// DIREITOS POR TIPO
// ============================================

export interface DireitosRescisao {
  saldoSalario: boolean;
  avisoPrevio: boolean;
  feriasVencidas: boolean;
  feriasProporcionais: boolean;
  decimoTerceiro: boolean;
  multaFgts: number; // percentual
  saqueFgts: number; // percentual
  seguroDesemprego: boolean;
}

export const direitosPorTipo: Record<TipoDesligamento, DireitosRescisao> = {
  sem_justa_causa: {
    saldoSalario: true,
    avisoPrevio: true,
    feriasVencidas: true,
    feriasProporcionais: true,
    decimoTerceiro: true,
    multaFgts: 40,
    saqueFgts: 100,
    seguroDesemprego: true,
  },
  com_justa_causa: {
    saldoSalario: true,
    avisoPrevio: false,
    feriasVencidas: true,
    feriasProporcionais: false,
    decimoTerceiro: false,
    multaFgts: 0,
    saqueFgts: 0,
    seguroDesemprego: false,
  },
  pedido_demissao: {
    saldoSalario: true,
    avisoPrevio: true,
    feriasVencidas: true,
    feriasProporcionais: true,
    decimoTerceiro: true,
    multaFgts: 0,
    saqueFgts: 0,
    seguroDesemprego: false,
  },
  acordo_mutuo: {
    saldoSalario: true,
    avisoPrevio: true, // 50%
    feriasVencidas: true,
    feriasProporcionais: true,
    decimoTerceiro: true,
    multaFgts: 20,
    saqueFgts: 80,
    seguroDesemprego: false,
  },
  culpa_reciproca: {
    saldoSalario: true,
    avisoPrevio: true, // 50%
    feriasVencidas: true,
    feriasProporcionais: true,
    decimoTerceiro: true,
    multaFgts: 20,
    saqueFgts: 100,
    seguroDesemprego: false,
  },
  fim_contrato: {
    saldoSalario: true,
    avisoPrevio: false,
    feriasVencidas: true,
    feriasProporcionais: true,
    decimoTerceiro: true,
    multaFgts: 0,
    saqueFgts: 100,
    seguroDesemprego: true,
  },
  aposentadoria: {
    saldoSalario: true,
    avisoPrevio: false,
    feriasVencidas: true,
    feriasProporcionais: true,
    decimoTerceiro: true,
    multaFgts: 40,
    saqueFgts: 100,
    seguroDesemprego: false,
  },
  falecimento: {
    saldoSalario: true,
    avisoPrevio: false,
    feriasVencidas: true,
    feriasProporcionais: true,
    decimoTerceiro: true,
    multaFgts: 40,
    saqueFgts: 100,
    seguroDesemprego: false,
  },
};
