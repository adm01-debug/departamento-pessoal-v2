// V15-298
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { empresaService } from '@/services';
import type { EmpresaFormData } from '@/types';
export const useEmpresas = () => useQuery({ queryKey: ['empresas'], queryFn: () => empresaService.list() });
export const useEmpresa = (id: string) => useQuery({ queryKey: ['empresa', id], queryFn: () => empresaService.getById(id), enabled: !!id });
export const useCreateEmpresa = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (d: EmpresaFormData) => empresaService.create(d), onSuccess: () => qc.invalidateQueries({ queryKey: ['empresas'] }) }); };
export const useUpdateEmpresa = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<EmpresaFormData> }) => empresaService.update(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['empresas'] }) }); };
