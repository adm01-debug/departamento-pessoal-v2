// V17-H012: useHolerite Real
import { useQuery, useMutation } from '@tanstack/react-query';
import { holeriteServiceReal } from '@/services/holeriteService.real';
export function useHoleriteReal(colaboradorId: string, competencia: string) {
  const query = useQuery({ queryKey: ['holerite', colaboradorId, competencia], queryFn: () => holeriteServiceReal.gerar(colaboradorId, competencia), enabled: !!(colaboradorId && competencia) });
  const gerarPDFMutation = useMutation({ mutationFn: () => holeriteServiceReal.gerarPDF(colaboradorId, competencia) });
  const enviarEmailMutation = useMutation({ mutationFn: () => holeriteServiceReal.enviarEmail(colaboradorId, competencia) });
  return { ...query, gerarPDF: gerarPDFMutation.mutateAsync, enviarEmail: enviarEmailMutation.mutateAsync };
}
export default useHoleriteReal;
