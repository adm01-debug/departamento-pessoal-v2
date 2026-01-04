import React from "react";
import { ResponsiveContainer, AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DataPoint { name: string; value: number; [key: string]: any; }
interface AreaChartProps { data: DataPoint[]; title?: string; description?: string; dataKey?: string; colors?: string[]; height?: number; showLegend?: boolean; showGrid?: boolean; className?: string; }

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function AreaChart({ data, title, description, dataKey = "value", colors = COLORS, height = 300, showLegend = true, showGrid = true, className }: AreaChartProps) {
  const chart = (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis dataKey="name" /><YAxis /><Tooltip />
        {showLegend && <Legend />}
        <Area type="monotone" dataKey={dataKey} stroke={colors[0]} fill={colors[0]} fillOpacity={0.3} />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
  if (!title) return <div className={className}>{chart}</div>;
  return <Card className={cn("", className)}><CardHeader><CardTitle>{title}</CardTitle>{description && <CardDescription>{description}</CardDescription>}</CardHeader><CardContent>{chart}</CardContent></Card>;
}
export default AreaChart;
