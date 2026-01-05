import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { folhaApi } from "@/api/folhaApi";
export const useFolhas = () => useQuery({ queryKey: ["folhas"], queryFn: folhaApi.listar });
export const useFolha = (id: string) => useQuery({ queryKey: ["folha", id], queryFn: () => folhaApi.buscar(id), enabled: !!id });
export const useFolhaCompetencia = (comp: string) => useQuery({ queryKey: ["folha", "competencia", comp], queryFn: () => folhaApi.buscarPorCompetencia(comp), enabled: !!comp });
export const useCalcularFolha = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ competencia, ids }: { competencia: string; ids?: string[] }) => folhaApi.calcular(competencia, ids), onSuccess: () => qc.invalidateQueries({ queryKey: ["folha"] }) }); };
export const useFecharFolha = () => { const qc = useQueryClient(); return useMutation({ mutationFn: folhaApi.fechar, onSuccess: () => qc.invalidateQueries({ queryKey: ["folha"] }) }); };
export const useEventosFolha = (folhaId: string) => useQuery({ queryKey: ["folha", folhaId, "eventos"], queryFn: () => folhaApi.listarEventos(folhaId), enabled: !!folhaId });
