import { apiClient } from "./client";
export interface AuditoriaLog { id: string; usuarioId: string; acao: string; entidade: string; entidadeId: string; dadosAnteriores?: any; dadosNovos?: any; ip?: string; userAgent?: string; createdAt: string; }
export const auditoriaApi = {
  listar: (params?: { entidade?: string; usuarioId?: string; dataInicio?: string; dataFim?: string }) => { const query = new URLSearchParams(params as any).toString(); return apiClient.get<AuditoriaLog[]>(`/auditoria${query ? `?${query}` : ""}`); },
  buscar: (id: string) => apiClient.get<AuditoriaLog>(`/auditoria/${id}`),
  porEntidade: (entidade: string, entidadeId: string) => apiClient.get<AuditoriaLog[]>(`/auditoria/entidade/${entidade}/${entidadeId}`),
  porUsuario: (usuarioId: string) => apiClient.get<AuditoriaLog[]>(`/auditoria/usuario/${usuarioId}`),
  exportar: (params: { dataInicio: string; dataFim: string; formato?: "csv" | "json" }) => apiClient.post<Blob>("/auditoria/exportar", params),
};
export default auditoriaApi;
