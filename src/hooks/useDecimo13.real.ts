// V17-H017: useDecimo13 Real
import { useQuery } from '@tanstack/react-query';
import { decimo13ServiceReal } from '@/services/decimo13Service.real';
export function useDecimo13Real(empresaId: string, ano: number) {
  const primeiraParcelaQuery = useQuery({ queryKey: ['decimo13-1p', empresaId, ano], queryFn: () => decimo13ServiceReal.calcularPrimeiraParcela(empresaId, ano), enabled: !!(empresaId && ano) });
  const segundaParcelaQuery = useQuery({ queryKey: ['decimo13-2p', empresaId, ano], queryFn: () => decimo13ServiceReal.calcularSegundaParcela(empresaId, ano), enabled: !!(empresaId && ano) });
  return { primeiraParcela: primeiraParcelaQuery.data, segundaParcela: segundaParcelaQuery.data, isLoading: primeiraParcelaQuery.isLoading };
}
export default useDecimo13Real;
