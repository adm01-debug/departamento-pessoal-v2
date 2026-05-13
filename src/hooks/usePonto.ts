import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pontosService } from '@/services/pontosService';
import { useEmpresa } from '@/contexts/EmpresaContext';
import { toast } from 'sonner';

export function usePonto(colaboradorId?: string) {
  const { empresaAtual } = useEmpresa();
  const queryClient = useQueryClient();

  const { data: registros = [], isLoading } = useQuery({
    queryKey: ['registros-ponto', empresaAtual?.id, colaboradorId],
    enabled: !!empresaAtual?.id,
    queryFn: () => pontosService.listar(colaboradorId!, undefined, undefined),
  });

  const { data: hoje } = useQuery({
    queryKey: ['ponto-hoje', colaboradorId],
    enabled: !!colaboradorId,
    queryFn: () => pontosService.buscarRegistroHoje(colaboradorId!),
  });

  const registrarPonto = useMutation({
    mutationFn: async ({ 
      tipo, 
      colaboradorId: colId, 
      geo,
      foto_biometria_url
    }: { 
      tipo: 'entrada' | 'saida_almoco' | 'retorno_almoco' | 'saida'; 
      colaboradorId: string;
      geo?: { latitude: number; longitude: number; accuracy: number };
      foto_biometria_url?: string | null;
    }) => {
      return pontosService.registrar(tipo, colId, {
        latitude: geo?.latitude,
        longitude: geo?.longitude,
        precisao: geo?.accuracy,
        dispositivoId: navigator.userAgent,
        foto_biometria_url
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registros-ponto'] });
      queryClient.invalidateQueries({ queryKey: ['ponto-hoje'] });
      toast.success('Ponto registrado com sucesso!');
    },
    onError: (e: Error) => toast.error(`Erro ao registrar ponto: ${e.message}`),
  });

  return { 
    registros, 
    hoje,
    isLoading, 
    registrarPonto: registrarPonto.mutateAsync,
    isRegistering: registrarPonto.isPending
  };
}
