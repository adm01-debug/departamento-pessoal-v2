import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { colaboradoresApi } from "@/api/colaboradoresApi";
export const useColaboradores = () => useQuery({ queryKey: ["colaboradores"], queryFn: colaboradoresApi.listar });
export const useColaborador = (id: string) => useQuery({ queryKey: ["colaborador", id], queryFn: () => colaboradoresApi.buscar(id), enabled: !!id });
export const useColaboradoresAtivos = () => useQuery({ queryKey: ["colaboradores", "ativos"], queryFn: colaboradoresApi.listarAtivos });
export const useCreateColaborador = () => { const qc = useQueryClient(); return useMutation({ mutationFn: colaboradoresApi.criar, onSuccess: () => qc.invalidateQueries({ queryKey: ["colaboradores"] }) }); };
export const useUpdateColaborador = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: any }) => colaboradoresApi.atualizar(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ["colaboradores"] }) }); };
export const useDeleteColaborador = () => { const qc = useQueryClient(); return useMutation({ mutationFn: colaboradoresApi.excluir, onSuccess: () => qc.invalidateQueries({ queryKey: ["colaboradores"] }) }); };
