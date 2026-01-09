import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressItem {
  label: string;
  value: number;
  max?: number;
  color?: string;
}

interface ProgressCardProps {
  title: string;
  items: ProgressItem[];
  showValues?: boolean;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressCard({ title, items, showValues = true, showPercentage = true, className }: ProgressCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, i) => {
          const percentage = item.max ? (item.value / item.max) * 100 : item.value;
          return (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{item.label}</span>
                <span className="text-muted-foreground">
                  {showValues && item.max && `${item.value}/${item.max}`}
                  {showValues && showPercentage && item.max && " "}
                  {showPercentage && `(${percentage.toFixed(0)}%)`}
                </span>
              </div>
              <Progress value={percentage} className="h-2" style={item.color ? { "--progress-color": item.color } as any : undefined} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
export default ProgressCard;
