import { pontoApi } from "@/api/pontoApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
export const usePonto = (competencia: string) => useQuery({ queryKey: ["ponto", competencia], queryFn: () => pontoApi.listar(competencia), enabled: !!competencia });
export const usePontoColaborador = (colaboradorId: string, competencia: string) => useQuery({ queryKey: ["ponto", "colaborador", colaboradorId, competencia], queryFn: () => pontoApi.porColaborador(colaboradorId, competencia), enabled: !!colaboradorId && !!competencia });
export const useInconsistenciasPonto = (competencia: string) => useQuery({ queryKey: ["ponto", "inconsistencias", competencia], queryFn: () => pontoApi.listarInconsistencias(competencia), enabled: !!competencia });
export const useRegistrarPonto = () => { const qc = useQueryClient(); return useMutation({ mutationFn: pontoApi.registrar, onSuccess: () => qc.invalidateQueries({ queryKey: ["ponto"] }) }); };
export const useAtualizarPonto = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: any }) => pontoApi.atualizar(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ["ponto"] }) }); };
