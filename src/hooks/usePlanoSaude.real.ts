// V17-H047: usePlanoSaude Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { planoSaudeServiceReal } from '@/services/planoSaudeService.real';
export function usePlanoSaudeReal(empresaId?: string, colaboradorId?: string) {
  const qc = useQueryClient();
  const planosQuery = useQuery({ queryKey: ['planos-saude', empresaId], queryFn: () => planoSaudeServiceReal.getPlanos(empresaId!), enabled: !!empresaId });
  const atribuirMutation = useMutation({ mutationFn: ({ colaboradorId, planoId, dependentes }: any) => planoSaudeServiceReal.atribuir(colaboradorId, planoId, dependentes), onSuccess: () => qc.invalidateQueries({ queryKey: ['planos-saude'] }) });
  const calcularDescontoQuery = useQuery({ queryKey: ['plano-saude-desconto', colaboradorId], queryFn: () => planoSaudeServiceReal.calcularDesconto(colaboradorId!), enabled: !!colaboradorId });
  return { planos: planosQuery.data, atribuir: atribuirMutation.mutateAsync, desconto: calcularDescontoQuery.data };
}
export default usePlanoSaudeReal;
