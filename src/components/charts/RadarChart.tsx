import React from "react";
import { ResponsiveContainer, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DataPoint { name: string; value: number; }
interface RadarChartProps { data: DataPoint[]; title?: string; dataKey?: string; color?: string; height?: number; className?: string; }

export function RadarChart({ data, title, dataKey = "value", color = "#3b82f6", height = 300, className }: RadarChartProps) {
  const chart = (<ResponsiveContainer width="100%" height={height}><RechartsRadarChart data={data}><PolarGrid /><PolarAngleAxis dataKey="name" /><PolarRadiusAxis /><Radar dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.3} /><Tooltip /><Legend /></RechartsRadarChart></ResponsiveContainer>);
  if (!title) return <div className={className}>{chart}</div>;
  return <Card className={cn("", className)}><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent>{chart}</CardContent></Card>;
}
export default RadarChart;
