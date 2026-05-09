import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bancoHorasService } from '@/services/bancoHorasService';
import { toast } from 'sonner';

export function usePontoBanco(colaboradorId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['banco-horas', colaboradorId],
    queryFn: () => bancoHorasService.listarPorColaborador(colaboradorId!),
    enabled: !!colaboradorId,
  });

  const saldoQuery = useQuery({
    queryKey: ['banco-horas-saldo', colaboradorId],
    queryFn: () => bancoHorasService.getSaldo(colaboradorId!),
    enabled: !!colaboradorId,
  });

  const registrarMutation = useMutation({
    mutationFn: (data: any) => bancoHorasService.registrar({ ...data, colaborador_id: colaboradorId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banco-horas', colaboradorId] });
      queryClient.invalidateQueries({ queryKey: ['banco-horas-saldo', colaboradorId] });
      toast.success('Registro de banco de horas salvo com sucesso.');
    },
    onError: (err: Error) => toast.error(`Erro: ${err.message}`),
  });

  return {
    registros: query.data || [],
    saldo: saldoQuery.data || 0,
    isLoading: query.isLoading || saldoQuery.isLoading,
    registrar: registrarMutation.mutateAsync,
    isRegistering: registrarMutation.isPending,
  };
}
