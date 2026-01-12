// V18-H003: useGraficos Real
import { useMemo } from "react";
export interface DadosGrafico { name: string; value: number; fill?: string; }
export function useGraficosReal<T>(dados: T[], config: { labelKey: keyof T; valueKey: keyof T; colors?: string[] }) {
  const dadosFormatados = useMemo(() => {
    const cores = config.colors || ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088fe"];
    return dados.map((item, i) => ({
      name: String(item[config.labelKey]),
      value: Number(item[config.valueKey]),
      fill: cores[i % cores.length]
    }));
  }, [dados, config]);
  const total = useMemo(() => dadosFormatados.reduce((acc, d) => acc + d.value, 0), [dadosFormatados]);
  const maximo = useMemo(() => Math.max(...dadosFormatados.map(d => d.value), 0), [dadosFormatados]);
  return { dados: dadosFormatados, total, maximo };
}
export default useGraficosReal;
