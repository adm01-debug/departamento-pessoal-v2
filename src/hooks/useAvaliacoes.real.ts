// V17-H045: useAvaliacoes Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { avaliacaoServiceReal } from '@/services/avaliacaoService.real';
export function useAvaliacoesReal(colaboradorId: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['avaliacoes', colaboradorId], queryFn: () => avaliacaoServiceReal.getByColaborador(colaboradorId), enabled: !!colaboradorId });
  const createMutation = useMutation({ mutationFn: ({ avaliadorId, periodo, nota, comentarios }: any) => avaliacaoServiceReal.criar(colaboradorId, avaliadorId, periodo, nota, comentarios), onSuccess: () => qc.invalidateQueries({ queryKey: ['avaliacoes'] }) });
  return { ...query, create: createMutation.mutateAsync };
}
export default useAvaliacoesReal;
