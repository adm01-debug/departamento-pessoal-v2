import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Settings, Maximize2, Minimize2, MoreVertical, RefreshCw, X, GripVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface DashboardWidgetProps { id: string; title: string; description?: string; children: React.ReactNode; loading?: boolean; error?: string; onRefresh?: () => void; onSettings?: () => void; onRemove?: () => void; expandable?: boolean; draggable?: boolean; footer?: React.ReactNode; className?: string; size?: "sm" | "md" | "lg" | "full"; }

export function DashboardWidget({ id, title, description, children, loading = false, error, onRefresh, onSettings, onRemove, expandable = false, draggable = false, footer, className, size = "md" }: DashboardWidgetProps) {
  const [expanded, setExpanded] = useState(false);
  const sizeClass = { sm: "col-span-1", md: "col-span-1 md:col-span-2", lg: "col-span-1 md:col-span-2 lg:col-span-3", full: "col-span-full" };

  if (loading) return <Card className={cn(sizeClass[size], className)}><CardHeader><Skeleton className="h-4 w-32" /></CardHeader><CardContent><Skeleton className="h-32 w-full" /></CardContent></Card>;

  return (
    <Card className={cn(sizeClass[size], expanded && "fixed inset-4 z-50 overflow-auto", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          {draggable && <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />}
          <div><CardTitle className="text-sm font-medium">{title}</CardTitle>{description && <CardDescription className="text-xs">{description}</CardDescription>}</div>
        </div>
        <div className="flex items-center gap-1">
          {onRefresh && <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onRefresh}><RefreshCw className="h-3 w-3" /></Button>}
          {expandable && <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setExpanded(!expanded)}>{expanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}</Button>}
          {(onSettings || onRemove) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><MoreVertical className="h-3 w-3" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onSettings && <DropdownMenuItem onClick={onSettings}><Settings className="h-4 w-4 mr-2" />Configurações</DropdownMenuItem>}
                {onRemove && <DropdownMenuItem onClick={onRemove} className="text-destructive"><X className="h-4 w-4 mr-2" />Remover</DropdownMenuItem>}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent>{error ? <div className="text-sm text-destructive py-4">{error}</div> : children}</CardContent>
      {footer && <CardFooter className="pt-0">{footer}</CardFooter>}
    </Card>
  );
}
export default DashboardWidget;
