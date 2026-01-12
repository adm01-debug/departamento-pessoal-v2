// V17-H058: useEnquetes Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enqueteServiceReal } from '@/services/enqueteService.real';
export function useEnquetesReal(empresaId: string, colaboradorId?: string) {
  const qc = useQueryClient();
  const createMutation = useMutation({ mutationFn: ({ titulo, opcoes, dataFim }: any) => enqueteServiceReal.criar(empresaId, titulo, opcoes, dataFim), onSuccess: () => qc.invalidateQueries({ queryKey: ['enquetes'] }) });
  const votarMutation = useMutation({ mutationFn: ({ enqueteId, opcao }: any) => enqueteServiceReal.votar(enqueteId, colaboradorId!, opcao) });
  return { criar: createMutation.mutateAsync, votar: votarMutation.mutateAsync };
}
export default useEnquetesReal;
