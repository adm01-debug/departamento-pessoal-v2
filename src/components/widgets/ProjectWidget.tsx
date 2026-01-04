import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProjectWidgetProps { title?: string; data?: any; className?: string; loading?: boolean; onRefresh?: () => void; }

export function ProjectWidget({ title = "ProjectWidget", data, className, loading = false, onRefresh }: ProjectWidgetProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{title}</CardTitle></CardHeader>
      <CardContent>{loading ? <div className="animate-pulse h-20 bg-muted rounded" /> : <div className="text-2xl font-bold">{data || "-"}</div>}</CardContent>
    </Card>
  );
}
export default ProjectWidget;
