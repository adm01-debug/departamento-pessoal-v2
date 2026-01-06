import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DataPoint {
  name?: string;
  label?: string;
  value: number;
  color?: string;
}

interface Props {
  data: DataPoint[];
  title?: string;
  colors?: string[];
  height?: number;
  className?: string;
  centerValue?: string;
  centerLabel?: string;
  showValues?: boolean;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function DonutChart({ 
  data, 
  title, 
  colors = COLORS, 
  height = 300, 
  className,
  centerValue,
  centerLabel,
  showValues 
}: Props) {
  // Normalize data to always have 'name' field
  const normalizedData = data.map(d => ({
    name: d.name || d.label || '',
    value: d.value,
  }));

  const chart = (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie 
          data={normalizedData} 
          dataKey="value" 
          nameKey="name" 
          cx="50%" 
          cy="50%" 
          innerRadius={60} 
          outerRadius={80} 
          label={showValues}
        >
          {normalizedData.map((_, i) => (
            <Cell key={i} fill={data[i]?.color || colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  if (!title) return <div className={className}>{chart}</div>;

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{chart}</CardContent>
    </Card>
  );
}

export default DonutChart;
