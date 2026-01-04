import React from "react";
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DataPoint { name: string; value: number; }
interface LineChartProps { data: DataPoint[]; title?: string; dataKey?: string; colors?: string[]; height?: number; className?: string; }

const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

export function LineChart({ data, title, dataKey = "value", colors = COLORS, height = 300, className }: LineChartProps) {
  const chart = (<ResponsiveContainer width="100%" height={height}><RechartsLineChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey={dataKey} stroke={colors[0]} strokeWidth={2} /></RechartsLineChart></ResponsiveContainer>);
  if (!title) return <div className={className}>{chart}</div>;
  return <Card className={cn("", className)}><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent>{chart}</CardContent></Card>;
}
export default LineChart;
