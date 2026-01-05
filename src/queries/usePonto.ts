import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pontoApi } from "@/api/pontoApi";
export const usePonto = (comp: string) => useQuery({ queryKey: ["ponto", comp], queryFn: () => pontoApi.listar(comp), enabled: !!comp });
export const usePontoColaborador = (colabId: string, comp: string) => useQuery({ queryKey: ["ponto", colabId, comp], queryFn: () => pontoApi.porColaborador(colabId, comp), enabled: !!colabId && !!comp });
export const useInconsistencias = (comp: string) => useQuery({ queryKey: ["ponto", "inconsistencias", comp], queryFn: () => pontoApi.listarInconsistencias(comp), enabled: !!comp });
export const useRegistrarPonto = () => { const qc = useQueryClient(); return useMutation({ mutationFn: pontoApi.registrar, onSuccess: () => qc.invalidateQueries({ queryKey: ["ponto"] }) }); };
export const useAtualizarPonto = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: any }) => pontoApi.atualizar(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ["ponto"] }) }); };
