import React from "react";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DataPoint { name: string; value: number; }
interface BarChartProps { data: DataPoint[]; title?: string; dataKey?: string; colors?: string[]; height?: number; showLegend?: boolean; className?: string; }

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export function BarChart({ data, title, dataKey = "value", colors = COLORS, height = 300, showLegend = true, className }: BarChartProps) {
  const chart = (<ResponsiveContainer width="100%" height={height}><RechartsBarChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip />{showLegend && <Legend />}<Bar dataKey={dataKey} fill={colors[0]} /></RechartsBarChart></ResponsiveContainer>);
  if (!title) return <div className={className}>{chart}</div>;
  return <Card className={cn("", className)}><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent>{chart}</CardContent></Card>;
}
export default BarChart;
