/**
 * @fileoverview Tipos para processo de desligamento
 * @module types/desligamento
 */

export type TipoDesligamento = 'demissao_sem_justa_causa' | 'demissao_justa_causa' | 'pedido_demissao' | 'acordo_mutuo' | 'aposentadoria' | 'falecimento';
export type StatusDesligamento = 'iniciado' | 'em_andamento' | 'aguardando_homologacao' | 'concluido' | 'cancelado';

export interface CalculoRescisao {
  saldoSalario: number;
  avisoPrevoio: number;
  feriasVencidas: number;
  feriasProporcionais: number;
  tercoConstitucional: number;
  decimoTerceiro: number;
  fgts: number;
  multaFgts: number;
  total: number;
}

export interface Desligamento {
  id: string;
  colaboradorId: string;
  tipo: TipoDesligamento;
  status: StatusDesligamento;
  dataDesligamento: string;
  dataAvisoPrevio?: string;
  motivoDetalhado?: string;
  calculo: CalculoRescisao;
  documentosGerados: string[];
  entrevistaDesligamento?: boolean;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DesligamentoFormData {
  colaboradorId: string;
  tipo: TipoDesligamento;
  dataDesligamento: string;
  cumprirAvisoPrevio: boolean;
  motivoDetalhado?: string;
}
