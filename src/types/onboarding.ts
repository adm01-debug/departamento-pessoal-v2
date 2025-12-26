/**
 * @fileoverview Tipos para onboarding de colaboradores
 * @module types/onboarding
 */

export type StatusOnboarding = 'nao_iniciado' | 'em_andamento' | 'concluido' | 'pausado';

export interface EtapaOnboarding {
  id: string;
  titulo: string;
  descricao?: string;
  ordem: number;
  obrigatoria: boolean;
  concluida: boolean;
  dataConclusao?: string;
  responsavel?: string;
}

export interface Onboarding {
  id: string;
  colaboradorId: string;
  status: StatusOnboarding;
  etapas: EtapaOnboarding[];
  progresso: number;
  dataInicio: string;
  dataPrevistaConclusao: string;
  dataConclusao?: string;
  mentorId?: string;
  observacoes?: string;
}

export interface TemplateOnboarding {
  id: string;
  nome: string;
  descricao?: string;
  etapas: Omit<EtapaOnboarding, 'id' | 'concluida' | 'dataConclusao'>[];
  duracaoDias: number;
  ativo: boolean;
}
