/**
 * @fileoverview Tipos para relatórios
 * @module types/relatorio
 */

export type TipoRelatorio = 'folha' | 'ferias' | 'ponto' | 'beneficios' | 'admissoes' | 'desligamentos' | 'headcount' | 'turnover' | 'absenteismo' | 'custom';
export type FormatoExportacao = 'pdf' | 'excel' | 'csv' | 'json';
export type PeriodoRelatorio = 'diario' | 'semanal' | 'mensal' | 'trimestral' | 'anual' | 'customizado';

export interface FiltroRelatorio {
  dataInicio: string;
  dataFim: string;
  departamentos?: string[];
  cargos?: string[];
  colaboradores?: string[];
  status?: string[];
}

export interface Relatorio {
  id: string;
  tipo: TipoRelatorio;
  titulo: string;
  descricao?: string;
  filtros: FiltroRelatorio;
  formato: FormatoExportacao;
  agendado: boolean;
  periodicidade?: PeriodoRelatorio;
  ultimaExecucao?: string;
  proximaExecucao?: string;
  urlDownload?: string;
  createdAt: string;
  createdBy: string;
}

export interface RelatorioConfig {
  tipo: TipoRelatorio;
  colunas: string[];
  ordenacao: { campo: string; direcao: 'asc' | 'desc' };
  agrupamento?: string;
}
