// V17-H006: useHorasExtras Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { horasExtrasServiceReal } from '@/services/horasExtrasService.real';
export function useHorasExtrasReal(colaboradorId?: string, mes?: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['horas-extras', colaboradorId, mes], queryFn: () => horasExtrasServiceReal.getByColaborador(colaboradorId!, mes), enabled: !!colaboradorId });
  const registrarMutation = useMutation({ mutationFn: horasExtrasServiceReal.registrar, onSuccess: () => qc.invalidateQueries({ queryKey: ['horas-extras'] }) });
  const aprovarMutation = useMutation({ mutationFn: ({ id, aprovadoPor }: any) => horasExtrasServiceReal.aprovar(id, aprovadoPor), onSuccess: () => qc.invalidateQueries({ queryKey: ['horas-extras'] }) });
  return { ...query, registrar: registrarMutation.mutateAsync, aprovar: aprovarMutation.mutateAsync };
}
export default useHorasExtrasReal;
