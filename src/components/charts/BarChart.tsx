import React from 'react';
import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from 'recharts';

interface DataPoint {
  [key: string]: string | number;
}

interface SimpleDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface Props {
  data: DataPoint[] | SimpleDataPoint[];
  xKey?: string;
  bars?: {
    dataKey: string;
    color: string;
    name?: string;
  }[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  stacked?: boolean;
  showValues?: boolean;
}

export function BarChart({
  data,
  xKey,
  bars,
  height = 300,
  showGrid = true,
  showLegend = true,
  stacked = false,
  showValues = false,
}: Props) {
  // Handle simple data format (label/value)
  const isSimpleFormat = data.length > 0 && 'label' in data[0] && 'value' in data[0];
  
  const chartData = isSimpleFormat 
    ? (data as SimpleDataPoint[]).map(d => ({ name: d.label, value: d.value }))
    : data;
  
  const chartXKey = xKey || 'name';
  const chartBars = bars || [{ dataKey: 'value', color: '#3b82f6', name: 'Valor' }];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBar data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis dataKey={chartXKey} />
        <YAxis />
        <Tooltip />
        {showLegend && <Legend />}
        {chartBars.map((bar) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            fill={bar.color}
            name={bar.name || bar.dataKey}
            stackId={stacked ? 'stack' : undefined}
          >
            {showValues && <LabelList dataKey={bar.dataKey} position="top" />}
          </Bar>
        ))}
      </RechartsBar>
    </ResponsiveContainer>
  );
}

export default BarChart;
