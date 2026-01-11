// V15-300
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feriasService } from '@/services';
import type { FeriasFormData } from '@/types';
export const useFeriasByColaborador = (colaboradorId: string) => useQuery({ queryKey: ['ferias', colaboradorId], queryFn: () => feriasService.listByColaborador(colaboradorId), enabled: !!colaboradorId });
export const useSolicitacoesFerias = (status?: string) => useQuery({ queryKey: ['ferias-solicitacoes', status], queryFn: () => feriasService.listSolicitacoes(status) });
export const useSolicitarFerias = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (d: FeriasFormData) => feriasService.solicitar(d), onSuccess: () => qc.invalidateQueries({ queryKey: ['ferias'] }) }); };
export const useAprovarFerias = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, aprovadorId }: { id: string; aprovadorId: string }) => feriasService.aprovar(id, aprovadorId), onSuccess: () => qc.invalidateQueries({ queryKey: ['ferias'] }) }); };
