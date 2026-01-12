// V17-H037: usePromocoes Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { promocaoServiceReal } from '@/services/promocaoService.real';
export function usePromocoesReal(colaboradorId: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['promocoes', colaboradorId], queryFn: () => promocaoServiceReal.getByColaborador(colaboradorId), enabled: !!colaboradorId });
  const createMutation = useMutation({ mutationFn: promocaoServiceReal.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['promocoes', 'colaboradores'] }) });
  return { ...query, create: createMutation.mutateAsync };
}
export default usePromocoesReal;
