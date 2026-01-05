import { apiClient } from "./client";
export interface EventoESocialAPI { id: string; tipo: string; colaboradorId?: string; competencia?: string; status: string; xml?: string; recibo?: string; dataEnvio?: string; erros?: string[]; }
export const esocialApi = {
  listar: (competencia?: string) => apiClient.get<EventoESocialAPI[]>(`/esocial${competencia ? `?competencia=${competencia}` : ""}`),
  buscar: (id: string) => apiClient.get<EventoESocialAPI>(`/esocial/${id}`),
  gerar: (tipo: string, dados: any) => apiClient.post<EventoESocialAPI>("/esocial/gerar", { tipo, ...dados }),
  transmitir: (id: string) => apiClient.post<EventoESocialAPI>(`/esocial/${id}/transmitir`, {}),
  transmitirLote: (ids: string[]) => apiClient.post<EventoESocialAPI[]>("/esocial/transmitir-lote", { ids }),
  consultar: (id: string) => apiClient.get<EventoESocialAPI>(`/esocial/${id}/consultar`),
  reprocessar: (id: string) => apiClient.post<EventoESocialAPI>(`/esocial/${id}/reprocessar`, {}),
  listarPendentes: () => apiClient.get<EventoESocialAPI[]>("/esocial/pendentes"),
  listarErros: () => apiClient.get<EventoESocialAPI[]>("/esocial/erros"),
};
export default esocialApi;
