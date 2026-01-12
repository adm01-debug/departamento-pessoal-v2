// V17-H005: useBancoHoras Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bancoHorasServiceReal } from '@/services/bancoHorasService.real';
export function useBancoHorasReal(colaboradorId: string) {
  const qc = useQueryClient();
  const saldoQuery = useQuery({ queryKey: ['banco-horas-saldo', colaboradorId], queryFn: () => bancoHorasServiceReal.getSaldo(colaboradorId), enabled: !!colaboradorId });
  const extratoQuery = useQuery({ queryKey: ['banco-horas-extrato', colaboradorId], queryFn: () => bancoHorasServiceReal.getExtrato(colaboradorId), enabled: !!colaboradorId });
  const registrarMutation = useMutation({ mutationFn: ({ tipo, minutos, motivo }: any) => bancoHorasServiceReal.registrar(colaboradorId, tipo, minutos, motivo), onSuccess: () => qc.invalidateQueries({ queryKey: ['banco-horas'] }) });
  return { saldo: saldoQuery.data, extrato: extratoQuery.data, registrar: registrarMutation.mutateAsync, isLoading: saldoQuery.isLoading };
}
export default useBancoHorasReal;
