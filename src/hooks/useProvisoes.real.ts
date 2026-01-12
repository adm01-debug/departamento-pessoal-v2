// V17-H015: useProvisoes Real
import { useQuery, useMutation } from '@tanstack/react-query';
import { provisoesServiceReal } from '@/services/provisoesService.real';
export function useProvisoesReal(empresaId: string, competencia: string) {
  const query = useQuery({ queryKey: ['provisoes', empresaId, competencia], queryFn: () => provisoesServiceReal.calcularMensal(empresaId, competencia), enabled: !!(empresaId && competencia) });
  const salvarMutation = useMutation({ mutationFn: (valores: any) => provisoesServiceReal.salvar(empresaId, competencia, valores) });
  return { ...query, salvar: salvarMutation.mutateAsync };
}
export default useProvisoesReal;
