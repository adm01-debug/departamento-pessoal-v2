// @ts-nocheck
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

interface MutationWithToastOptions<TData, TVariables> extends Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'> {
  successMessage?: string;
  errorMessage?: string;
  invalidateKeys?: string[];
}

/**
 * Hook wrapper para useMutation com toast e invalidação automática
 */
export function useMutationWithToast<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: MutationWithToastOptions<TData, TVariables>
) {
  const queryClient = useQueryClient();
  const { successMessage, errorMessage, invalidateKeys, ...mutationOptions } = options ?? {};

  return useMutation<TData, Error, TVariables>({
    mutationFn,
    onSuccess: (data, variables, context) => {
      if (successMessage) {
        toast({ title: 'Sucesso', description: successMessage });
      }
      if (invalidateKeys?.length) {
        invalidateKeys.forEach(key => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast({
        title: 'Erro',
        description: errorMessage ?? error.message ?? 'Ocorreu um erro',
        variant: 'destructive',
      });
      options?.onError?.(error, variables, context);
    },
    ...mutationOptions,
  });
}

export default useMutationWithToast;
