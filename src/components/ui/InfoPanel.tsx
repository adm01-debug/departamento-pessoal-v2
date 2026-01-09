import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface InfoItem { label: string; value: React.ReactNode; }
interface InfoPanelProps { title: string; icon?: LucideIcon; items: InfoItem[]; className?: string; }

export function InfoPanel({ title, icon: Icon, items, className }: InfoPanelProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">{Icon && <Icon className="h-4 w-4" />}{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between py-1 border-b last:border-0">
              <dt className="text-sm text-muted-foreground">{item.label}</dt>
              <dd className="text-sm font-medium">{item.value || "-"}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
export default InfoPanel;
