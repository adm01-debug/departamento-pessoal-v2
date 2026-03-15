import { useQuery } from '@tanstack/react-query';
import { folhaService } from '@/services';

export function useFolha(competencia?: string) {
  const query = useQuery({
    queryKey: ['folha', competencia],
    queryFn: () => folhaService.list(competencia),
  });

  return {
    folhas: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
