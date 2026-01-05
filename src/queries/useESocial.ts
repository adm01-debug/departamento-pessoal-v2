import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { esocialApi } from "@/api/esocialApi";
export const useEventosESocial = (comp?: string) => useQuery({ queryKey: ["esocial", comp], queryFn: () => esocialApi.listar(comp) });
export const useEventoPendentes = () => useQuery({ queryKey: ["esocial", "pendentes"], queryFn: esocialApi.listarPendentes });
export const useEventosErros = () => useQuery({ queryKey: ["esocial", "erros"], queryFn: esocialApi.listarErros });
export const useGerarEvento = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ tipo, dados }: { tipo: string; dados: any }) => esocialApi.gerar(tipo, dados), onSuccess: () => qc.invalidateQueries({ queryKey: ["esocial"] }) }); };
export const useTransmitirEvento = () => { const qc = useQueryClient(); return useMutation({ mutationFn: esocialApi.transmitir, onSuccess: () => qc.invalidateQueries({ queryKey: ["esocial"] }) }); };
export const useTransmitirLote = () => { const qc = useQueryClient(); return useMutation({ mutationFn: esocialApi.transmitirLote, onSuccess: () => qc.invalidateQueries({ queryKey: ["esocial"] }) }); };
