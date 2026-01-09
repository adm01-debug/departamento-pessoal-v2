import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ActionGridItem { icon: LucideIcon; label: string; description?: string; onClick: () => void; color?: string; }
interface ActionGridProps { items: ActionGridItem[]; columns?: 2 | 3 | 4; className?: string; }

export function ActionGrid({ items, columns = 3, className }: ActionGridProps) {
  const gridCols = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" };

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow" onClick={item.onClick}>
            <CardContent className="p-4 text-center">
              <div className="h-12 w-12 rounded-lg mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: item.color ? `${item.color}20` : "hsl(var(--primary) / 0.1)" }}>
                <Icon className="h-6 w-6" style={{ color: item.color || "hsl(var(--primary))" }} />
              </div>
              <p className="font-medium text-sm">{item.label}</p>
              {item.description && <p className="text-xs text-muted-foreground mt-1">{item.description}</p>}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
export default ActionGrid;
