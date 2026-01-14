// V20: Services Index - Apenas exports funcionais
export { authService } from "./authService";
export { empresaService } from "./empresaService";

// Stub services para evitar erros de importação
export const colaboradorService = { list: async () => [], getById: async () => null };
export const folhaService = { list: async () => [], getById: async () => null };
export const feriasService = { list: async () => [], getById: async () => null };
export const pontoService = { list: async () => [], getById: async () => null };
export const beneficioService = { list: async () => [], getById: async () => null };
export const dashboardService = { getStats: async () => ({}), getKPIs: async () => ({}) };
export const relatorioService = { list: async () => [], generate: async () => null };
export const notificacaoService = { list: async () => [], send: async () => null };
export const auditService = { list: async () => [], log: async () => null };
export const configService = { get: async () => ({}), set: async () => null };
export const backupService = { create: async () => null, restore: async () => null };
export const usuarioService = { list: async () => [], getById: async () => null };