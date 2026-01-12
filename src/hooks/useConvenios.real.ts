// V17-H059: useConvenios Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { convenioServiceReal } from '@/services/convenioService.real';
export function useConveniosReal(empresaId: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['convenios', empresaId], queryFn: () => convenioServiceReal.getAll(empresaId), enabled: !!empresaId });
  const createMutation = useMutation({ mutationFn: ({ nome, tipo, desconto }: any) => convenioServiceReal.criar(empresaId, nome, tipo, desconto), onSuccess: () => qc.invalidateQueries({ queryKey: ['convenios'] }) });
  return { ...query, create: createMutation.mutateAsync };
}
export default useConveniosReal;
