import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataPoint { label: string; value: number; }
interface TrendChartProps { title: string; data: DataPoint[]; color?: string; className?: string; }

export function TrendChart({ title, data, color = "#3b82f6", className }: TrendChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value - minValue) / range) * 80 - 10;
    return `${x},${y}`;
  }).join(" ");

  return (
    <Card className={className}>
      <CardHeader className="pb-2"><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent>
        <svg viewBox="0 0 100 60" className="w-full h-32">
          <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = 100 - ((d.value - minValue) / range) * 80 - 10;
            return <circle key={i} cx={x} cy={y} r="2" fill={color} />;
          })}
        </svg>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          {data.filter((_, i) => i === 0 || i === data.length - 1).map((d, i) => <span key={i}>{d.label}</span>)}
        </div>
      </CardContent>
    </Card>
  );
}
export default TrendChart;
