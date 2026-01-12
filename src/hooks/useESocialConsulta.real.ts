// V17-H023: useESocialConsulta Real
import { useQuery } from '@tanstack/react-query';
import { esocialServiceReal } from '@/services/esocialService.real';
export function useESocialConsultaReal(eventoId: string) {
  const query = useQuery({ queryKey: ['esocial-retorno', eventoId], queryFn: () => esocialServiceReal.consultarRetorno(eventoId), enabled: !!eventoId, refetchInterval: 30000 });
  return query;
}
export default useESocialConsultaReal;
