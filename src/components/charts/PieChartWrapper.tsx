import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
interface PieChartWrapperProps { data: { name: string; value: number }[]; colors?: string[]; height?: number; }
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
export function PieChartWrapper({ data, colors = COLORS, height = 300 }: PieChartWrapperProps) {
  return (<ResponsiveContainer width="100%" height={height}><PieChart><Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value">{data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer>);
}
