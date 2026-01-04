import React from "react";
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DataPoint { name: string; value: number; }
interface PieChartProps { data: DataPoint[]; title?: string; colors?: string[]; height?: number; className?: string; }

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function PieChart({ data, title, colors = COLORS, height = 300, className }: PieChartProps) {
  const chart = (<ResponsiveContainer width="100%" height={height}><RechartsPieChart><Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>{data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}</Pie><Tooltip /><Legend /></RechartsPieChart></ResponsiveContainer>);
  if (!title) return <div className={className}>{chart}</div>;
  return <Card className={cn("", className)}><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent>{chart}</CardContent></Card>;
}
export default PieChart;
