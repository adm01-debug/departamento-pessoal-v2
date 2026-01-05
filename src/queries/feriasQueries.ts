import { feriasApi } from "@/api/feriasApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
export const useFerias = () => useQuery({ queryKey: ["ferias"], queryFn: feriasApi.listar });
export const useFeriasColaborador = (colaboradorId: string) => useQuery({ queryKey: ["ferias", "colaborador", colaboradorId], queryFn: () => feriasApi.porColaborador(colaboradorId), enabled: !!colaboradorId });
export const useFeriasVencidas = () => useQuery({ queryKey: ["ferias", "vencidas"], queryFn: feriasApi.listarVencidas });
export const useFeriasProximas = (dias: number = 30) => useQuery({ queryKey: ["ferias", "proximas", dias], queryFn: () => feriasApi.listarProximas(dias) });
export const useProgramarFerias = () => { const qc = useQueryClient(); return useMutation({ mutationFn: feriasApi.programar, onSuccess: () => qc.invalidateQueries({ queryKey: ["ferias"] }) }); };
export const useAprovarFerias = () => { const qc = useQueryClient(); return useMutation({ mutationFn: feriasApi.aprovar, onSuccess: () => qc.invalidateQueries({ queryKey: ["ferias"] }) }); };
