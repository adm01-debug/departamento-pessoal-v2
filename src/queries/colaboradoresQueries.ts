import { colaboradoresApi, ColaboradorAPI } from "@/api/colaboradoresApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
export const useColaboradores = () => useQuery({ queryKey: ["colaboradores"], queryFn: colaboradoresApi.listar });
export const useColaborador = (id: string) => useQuery({ queryKey: ["colaborador", id], queryFn: () => colaboradoresApi.buscar(id), enabled: !!id });
export const useColaboradoresAtivos = () => useQuery({ queryKey: ["colaboradores", "ativos"], queryFn: colaboradoresApi.listarAtivos });
export const useCriarColaborador = () => { const qc = useQueryClient(); return useMutation({ mutationFn: colaboradoresApi.criar, onSuccess: () => qc.invalidateQueries({ queryKey: ["colaboradores"] }) }); };
export const useAtualizarColaborador = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<ColaboradorAPI> }) => colaboradoresApi.atualizar(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ["colaboradores"] }) }); };
export const useExcluirColaborador = () => { const qc = useQueryClient(); return useMutation({ mutationFn: colaboradoresApi.excluir, onSuccess: () => qc.invalidateQueries({ queryKey: ["colaboradores"] }) }); };
