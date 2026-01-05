import { folhaApi } from "@/api/folhaApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
export const useFolhas = () => useQuery({ queryKey: ["folhas"], queryFn: folhaApi.listar });
export const useFolha = (id: string) => useQuery({ queryKey: ["folha", id], queryFn: () => folhaApi.buscar(id), enabled: !!id });
export const useFolhaCompetencia = (competencia: string) => useQuery({ queryKey: ["folha", "competencia", competencia], queryFn: () => folhaApi.buscarPorCompetencia(competencia), enabled: !!competencia });
export const useCalcularFolha = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ competencia, colaboradorIds }: { competencia: string; colaboradorIds?: string[] }) => folhaApi.calcular(competencia, colaboradorIds), onSuccess: () => qc.invalidateQueries({ queryKey: ["folha"] }) }); };
export const useFecharFolha = () => { const qc = useQueryClient(); return useMutation({ mutationFn: folhaApi.fechar, onSuccess: () => qc.invalidateQueries({ queryKey: ["folha"] }) }); };
export const useEventosFolha = (folhaId: string) => useQuery({ queryKey: ["folha", folhaId, "eventos"], queryFn: () => folhaApi.listarEventos(folhaId), enabled: !!folhaId });
