import React from "react";
import { ResponsiveContainer, ScatterChart as RechartsScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DataPoint { x: number; y: number; name?: string; }
interface ScatterChartProps { data: DataPoint[]; title?: string; color?: string; height?: number; className?: string; }

export function ScatterChart({ data, title, color = "#3b82f6", height = 300, className }: ScatterChartProps) {
  const chart = (<ResponsiveContainer width="100%" height={height}><RechartsScatterChart><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="x" type="number" /><YAxis dataKey="y" type="number" /><Tooltip /><Legend /><Scatter data={data} fill={color} /></RechartsScatterChart></ResponsiveContainer>);
  if (!title) return <div className={className}>{chart}</div>;
  return <Card className={cn("", className)}><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent>{chart}</CardContent></Card>;
}
export default ScatterChart;
