// V18: Types Index - Exportações Centralizadas

// Core Types - use explicit exports to avoid conflicts
export type { Colaborador, StatusColaborador, TipoContrato } from './colaborador';
export type { Empresa } from './empresa';
export type { Ferias, SolicitacaoFerias, FeriasWithColaborador, FeriasFormData, CalculoFerias, StatusFerias, StatusPeriodo, StatusSolicitacao } from './ferias';

// Comum
export * from './common';

// Re-export de tipos do database
export type { Database, Json } from './database';
