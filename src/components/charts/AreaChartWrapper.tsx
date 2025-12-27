import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
interface AreaChartWrapperProps { data: any[]; dataKey: string; xAxisKey: string; color?: string; height?: number; }
export function AreaChartWrapper({ data, dataKey, xAxisKey, color = '#8884d8', height = 300 }: AreaChartWrapperProps) {
  return (<ResponsiveContainer width="100%" height={height}><AreaChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey={xAxisKey} /><YAxis /><Tooltip /><Area type="monotone" dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.3} /></AreaChart></ResponsiveContainer>);
}
