import { beneficiosApi } from "@/api/beneficiosApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
export const useBeneficios = () => useQuery({ queryKey: ["beneficios"], queryFn: beneficiosApi.listar });
export const useBeneficiosColaborador = (colaboradorId: string) => useQuery({ queryKey: ["beneficios", "colaborador", colaboradorId], queryFn: () => beneficiosApi.listarPorColaborador(colaboradorId), enabled: !!colaboradorId });
export const useCriarBeneficio = () => { const qc = useQueryClient(); return useMutation({ mutationFn: beneficiosApi.criar, onSuccess: () => qc.invalidateQueries({ queryKey: ["beneficios"] }) }); };
export const useVincularBeneficio = () => { const qc = useQueryClient(); return useMutation({ mutationFn: beneficiosApi.vincular, onSuccess: () => qc.invalidateQueries({ queryKey: ["beneficios"] }) }); };
