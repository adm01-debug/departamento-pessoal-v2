// V17-H054: useHealth Real
import { useQuery } from '@tanstack/react-query';
import { healthServiceReal } from '@/services/healthService.real';
export function useHealthReal() {
  const query = useQuery({ queryKey: ['health'], queryFn: () => healthServiceReal.check(), refetchInterval: 60000 });
  return query;
}
export default useHealthReal;
