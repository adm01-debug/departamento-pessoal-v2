import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface InfoItem { label: string; value: React.ReactNode; icon?: LucideIcon; }

interface InfoCardProps {
  items: InfoItem[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
  variant?: "default" | "bordered" | "minimal";
}

export function InfoCard({ items, columns = 2, className, variant = "default" }: InfoCardProps) {
  const gridCols = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" };

  const content = (
    <div className={cn("grid gap-4", gridCols[columns])}>
      {items.map((item, i) => (
        <div key={i} className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {item.icon && <item.icon className="h-4 w-4" />}
            {item.label}
          </div>
          <div className="font-medium">{item.value || "-"}</div>
        </div>
      ))}
    </div>
  );

  if (variant === "minimal") return <div className={className}>{content}</div>;

  return (
    <Card className={cn(variant === "bordered" && "border-2", className)}>
      <CardContent className="pt-6">{content}</CardContent>
    </Card>
  );
}
export default InfoCard;
