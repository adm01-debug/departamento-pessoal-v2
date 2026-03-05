import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from '@/components/charts/BarChart';

interface Props {
  data: { competencia: string; bruto: number; liquido: number }[];
}

export function FolhaChart({ data }: Props) {
  const chartData = data.map(d => ({ name: d.competencia, Bruto: d.bruto, Líquido: d.liquido }));
  return (
    <BarChart
      title="Evolução da Folha"
      data={chartData}
      xKey="name"
      bars={[
        { dataKey: 'Bruto', color: '#3b82f6', name: 'Bruto' },
        { dataKey: 'Líquido', color: '#22c55e', name: 'Líquido' },
      ]}
    />
  );
}
