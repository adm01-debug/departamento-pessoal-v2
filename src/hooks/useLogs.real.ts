// V17-H053: useLogs Real
import { useQuery } from '@tanstack/react-query';
import { logServiceReal } from '@/services/logService.real';
export function useLogsReal(empresaId: string) {
  const query = useQuery({ queryKey: ['logs', empresaId], queryFn: () => logServiceReal.getAll(empresaId), enabled: !!empresaId });
  return query;
}
export default useLogsReal;
