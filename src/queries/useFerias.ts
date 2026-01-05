import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { feriasApi } from "@/api/feriasApi";
export const useFerias = () => useQuery({ queryKey: ["ferias"], queryFn: feriasApi.listar });
export const useFeriasColaborador = (colabId: string) => useQuery({ queryKey: ["ferias", "colaborador", colabId], queryFn: () => feriasApi.porColaborador(colabId), enabled: !!colabId });
export const useFeriasVencidas = () => useQuery({ queryKey: ["ferias", "vencidas"], queryFn: feriasApi.listarVencidas });
export const useProgramarFerias = () => { const qc = useQueryClient(); return useMutation({ mutationFn: feriasApi.programar, onSuccess: () => qc.invalidateQueries({ queryKey: ["ferias"] }) }); };
export const useAprovarFerias = () => { const qc = useQueryClient(); return useMutation({ mutationFn: feriasApi.aprovar, onSuccess: () => qc.invalidateQueries({ queryKey: ["ferias"] }) }); };
export const useCancelarFerias = () => { const qc = useQueryClient(); return useMutation({ mutationFn: feriasApi.cancelar, onSuccess: () => qc.invalidateQueries({ queryKey: ["ferias"] }) }); };
