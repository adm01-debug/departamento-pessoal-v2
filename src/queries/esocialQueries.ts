import { esocialApi } from "@/api/esocialApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
export const useEventosESocial = (competencia?: string) => useQuery({ queryKey: ["esocial", competencia], queryFn: () => esocialApi.listar(competencia) });
export const useEventoESocial = (id: string) => useQuery({ queryKey: ["esocial", "evento", id], queryFn: () => esocialApi.buscar(id), enabled: !!id });
export const useEventosPendentes = () => useQuery({ queryKey: ["esocial", "pendentes"], queryFn: esocialApi.listarPendentes });
export const useEventosErros = () => useQuery({ queryKey: ["esocial", "erros"], queryFn: esocialApi.listarErros });
export const useGerarEvento = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ tipo, dados }: { tipo: string; dados: any }) => esocialApi.gerar(tipo, dados), onSuccess: () => qc.invalidateQueries({ queryKey: ["esocial"] }) }); };
export const useTransmitirEvento = () => { const qc = useQueryClient(); return useMutation({ mutationFn: esocialApi.transmitir, onSuccess: () => qc.invalidateQueries({ queryKey: ["esocial"] }) }); };
export const useTransmitirLote = () => { const qc = useQueryClient(); return useMutation({ mutationFn: esocialApi.transmitirLote, onSuccess: () => qc.invalidateQueries({ queryKey: ["esocial"] }) }); };
