// V18: Types Index - Exportações Centralizadas
export type { Colaborador, StatusColaborador, TipoContrato } from './colaborador';
export type { Empresa } from './empresa';
export type { Ferias, SolicitacaoFerias, FeriasWithColaborador, FeriasFormData, CalculoFerias, StatusFerias, StatusPeriodo, StatusSolicitacao } from './ferias';
export * from './common';
export type { Database, Json } from './database';

// Additional type stubs for components
export interface Beneficio { id: string; nome: string; tipo: string; valor: number; ativo: boolean; }
export interface ColaboradorFilters { search?: string; status?: string; departamento?: string; cargo?: string; }
export interface Documento { id: string; nome: string; tipo: string; url: string; colaborador_id: string; created_at: string; }
export interface ItemFolha { id: string; descricao: string; tipo: string; valor: number; referencia?: number; }
export interface FolhaPagamento { id: string; competencia: string; status: string; total_proventos: number; total_descontos: number; total_liquido: number; }
export interface RegistroPonto { id: string; colaborador_id: string; data: string; entrada?: string; saida_almoco?: string; retorno_almoco?: string; saida?: string; }
