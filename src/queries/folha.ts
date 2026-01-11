// V15-299
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { folhaService } from '@/services';
import type { FolhaFilters } from '@/types';
export const useFolhas = (filters?: FolhaFilters) => useQuery({ queryKey: ['folhas', filters], queryFn: () => folhaService.list(filters) });
export const useFolha = (id: string) => useQuery({ queryKey: ['folha', id], queryFn: () => folhaService.getById(id), enabled: !!id });
export const useFolhaItens = (folhaId: string) => useQuery({ queryKey: ['folha-itens', folhaId], queryFn: () => folhaService.getItens(folhaId), enabled: !!folhaId });
export const useCalcularFolha = () => { const qc = useQueryClient(); return useMutation({ mutationFn: ({ empresaId, competencia }: { empresaId: string; competencia: string }) => folhaService.calcular(empresaId, competencia), onSuccess: () => qc.invalidateQueries({ queryKey: ['folhas'] }) }); };
export const useFecharFolha = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => folhaService.fechar(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['folhas'] }) }); };
