import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GaugeChartProps { title: string; value: number; max?: number; label?: string; color?: string; className?: string; }

export function GaugeChart({ title, value, max = 100, label, color = "#3b82f6", className }: GaugeChartProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const rotation = (percentage / 100) * 180 - 90;

  return (
    <Card className={className}>
      <CardHeader className="pb-2"><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-32 h-16 overflow-hidden">
          <div className="absolute inset-0 rounded-t-full border-8 border-muted" />
          <div className="absolute inset-0 rounded-t-full border-8 border-transparent origin-bottom" style={{ borderTopColor: color, transform: `rotate(${rotation}deg)`, clipPath: "inset(0 0 50% 0)" }} />
        </div>
        <div className="text-center -mt-2">
          <p className="text-2xl font-bold">{value}</p>
          {label && <p className="text-sm text-muted-foreground">{label}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
export default GaugeChart;
