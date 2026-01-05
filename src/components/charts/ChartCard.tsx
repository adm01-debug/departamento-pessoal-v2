import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface ChartCardProps { title: string; description?: string; children: React.ReactNode; action?: React.ReactNode; className?: string; }
export function ChartCard({ title, description, children, action, className }: ChartCardProps) {
  return (
    <Card className={className}><CardHeader className="flex flex-row items-center justify-between pb-2"><div><CardTitle className="text-base">{title}</CardTitle>{description && <p className="text-sm text-muted-foreground">{description}</p>}</div>{action}</CardHeader><CardContent>{children}</CardContent></Card>
  );
}
export default ChartCard;
