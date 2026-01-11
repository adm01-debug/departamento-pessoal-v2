// V15-297
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { colaboradorService } from '@/services';
import type { ColaboradorFilters, ColaboradorFormData } from '@/types';
export const useColaboradores = (filters?: ColaboradorFilters) => useQuery({ queryKey: ['colaboradores', filters], queryFn: () => colaboradorService.list(filters) });
export const useColaborador = (id: string) => useQuery({ queryKey: ['colaborador', id], queryFn: () => colaboradorService.getById(id), enabled: !!id });
export const useCreateColaborador = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (d: ColaboradorFormData) => colaboradorService.create(d), onSuccess: () => qc.invalidateQueries({ queryKey: ['colaboradores'] }) }); };
export const useUpdateColaborador = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<ColaboradorFormData> }) => colaboradorService.update(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['colaboradores'] }) }); };
export const useDeleteColaborador = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => colaboradorService.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['colaboradores'] }) }); };
