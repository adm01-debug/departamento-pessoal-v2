import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { beneficiosApi } from "@/api/beneficiosApi";
export const useBeneficios = () => useQuery({ queryKey: ["beneficios"], queryFn: beneficiosApi.listar });
export const useBeneficiosColaborador = (colabId: string) => useQuery({ queryKey: ["beneficios", "colaborador", colabId], queryFn: () => beneficiosApi.listarPorColaborador(colabId), enabled: !!colabId });
export const useCreateBeneficio = () => { const qc = useQueryClient(); return useMutation({ mutationFn: beneficiosApi.criar, onSuccess: () => qc.invalidateQueries({ queryKey: ["beneficios"] }) }); };
export const useVincularBeneficio = () => { const qc = useQueryClient(); return useMutation({ mutationFn: beneficiosApi.vincular, onSuccess: () => qc.invalidateQueries({ queryKey: ["beneficios"] }) }); };
