import { useQuery } from "@tanstack/react-query";
import { auditoriaApi } from "@/api/auditoriaApi";
export const useAuditoria = (params?: { entidade?: string; usuarioId?: string; dataInicio?: string; dataFim?: string }) => useQuery({ queryKey: ["auditoria", params], queryFn: () => auditoriaApi.listar(params) });
export const useAuditoriaEntidade = (entidade: string, entidadeId: string) => useQuery({ queryKey: ["auditoria", entidade, entidadeId], queryFn: () => auditoriaApi.porEntidade(entidade, entidadeId), enabled: !!entidade && !!entidadeId });
export const useAuditoriaUsuario = (usuarioId: string) => useQuery({ queryKey: ["auditoria", "usuario", usuarioId], queryFn: () => auditoriaApi.porUsuario(usuarioId), enabled: !!usuarioId });
