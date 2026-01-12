// V17-H038: useTransferencias Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transferenciaServiceReal } from '@/services/transferenciaService.real';
export function useTransferenciasReal(colaboradorId: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['transferencias', colaboradorId], queryFn: () => transferenciaServiceReal.getByColaborador(colaboradorId), enabled: !!colaboradorId });
  const createMutation = useMutation({ mutationFn: transferenciaServiceReal.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['transferencias', 'colaboradores'] }) });
  return { ...query, create: createMutation.mutateAsync };
}
export default useTransferenciasReal;
