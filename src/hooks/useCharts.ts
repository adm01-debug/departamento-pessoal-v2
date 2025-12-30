/**
 * @fileoverview Hook para configuração de charts
 * @module hooks/useCharts
 */
import { useMemo } from 'react';

export interface ChartConfig {
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  colors?: string[];
}

const defaultColors = [
  'hsl(var(--primary))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--destructive))',
  'hsl(var(--info))',
];

export function useCharts(config: ChartConfig = {}) {
  const chartConfig = useMemo(() => ({
    width: config.width ?? 400,
    height: config.height ?? 300,
    margin: config.margin ?? { top: 20, right: 20, bottom: 20, left: 20 },
    colors: config.colors ?? defaultColors,
  }), [config]);

  const getColor = (index: number) => chartConfig.colors[index % chartConfig.colors.length];

  return { ...chartConfig, getColor };
}

export default useCharts;
