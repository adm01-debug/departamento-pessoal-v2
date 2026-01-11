// V15-301
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { beneficioService } from '@/services';
import type { BeneficioFormData, AtribuirBeneficioData } from '@/types';
export const useBeneficios = (empresaId: string) => useQuery({ queryKey: ['beneficios', empresaId], queryFn: () => beneficioService.list(empresaId), enabled: !!empresaId });
export const useBeneficiosColaborador = (colaboradorId: string) => useQuery({ queryKey: ['beneficios-colaborador', colaboradorId], queryFn: () => beneficioService.listByColaborador(colaboradorId), enabled: !!colaboradorId });
export const useCreateBeneficio = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (d: BeneficioFormData) => beneficioService.create(d), onSuccess: () => qc.invalidateQueries({ queryKey: ['beneficios'] }) }); };
export const useAtribuirBeneficio = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (d: AtribuirBeneficioData) => beneficioService.atribuir(d), onSuccess: () => qc.invalidateQueries({ queryKey: ['beneficios'] }) }); };
