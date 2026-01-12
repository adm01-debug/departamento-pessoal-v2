// V17-H013: useEncargos Real
import { useQuery } from '@tanstack/react-query';
import { encargosServiceReal } from '@/services/encargosService.real';
export function useEncargosReal(empresaId: string, competencia: string) {
  const query = useQuery({ queryKey: ['encargos', empresaId, competencia], queryFn: () => encargosServiceReal.getByCompetencia(empresaId, competencia), enabled: !!(empresaId && competencia) });
  const calcular = (baseCalculo: number) => encargosServiceReal.calcular(baseCalculo);
  return { ...query, calcular };
}
export default useEncargosReal;
