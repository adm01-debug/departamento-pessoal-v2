// @ts-nocheck
// V21-012: Index de Exports Services
export { default as inssService } from './inssService';
export { default as irrfService } from './irrfService';
export { default as esocialService } from './esocialService';
export { default as reciboService } from './reciboService';
export { default as guiaService } from './guiaService';
export { default as encargosService } from './encargosService';
export { default as provisoesService } from './provisoesService';
export { default as cnab240Service } from './cnab240Service';
export { default as contabilizacaoService } from './contabilizacaoService';
export { default as simulacaoService } from './simulacaoService';
export { default as auditLogService } from './auditLogService';

// Stub services for pages that need them
export const beneficioService = { listar: async () => [], criar: async (d: any) => d, atualizar: async (id: string, d: any) => d, excluir: async (id: string) => {} };
export const colaboradorService = { listar: async () => [], buscarPorId: async (id: string) => null, criar: async (d: any) => d, atualizar: async (id: string, d: any) => d, excluir: async (id: string) => {} };
export const empresaService = { listar: async () => [], buscarPorId: async (id: string) => null, criar: async (d: any) => d, atualizar: async (id: string, d: any) => d, excluir: async (id: string) => {} };
export const feriasService = { listar: async () => [], aprovar: async (id: string) => {}, rejeitar: async (id: string) => {} };
export const folhaService = { listar: async () => [], buscarPorId: async (id: string) => null };
export const pontoService = { registrar: async (tipo: string) => ({}) };
export const fgtsService = { calcular: (salario: number) => salario * 0.08 };

// Types re-exports
export type { DadosRecibo, ReciboGerado } from './reciboService';
export type { TipoGuia, DadosGuia, GuiaGerada } from './guiaService';
export type { EncargosResult, EncargosParams } from './encargosService';
export type { SimulacaoParams, SimulacaoResult } from './simulacaoService';
