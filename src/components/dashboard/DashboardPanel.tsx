import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Maximize2, Minimize2, X, GripVertical } from "lucide-react";

interface DashboardPanelProps { title: string; description?: string; children: React.ReactNode; collapsible?: boolean; defaultCollapsed?: boolean; removable?: boolean; onRemove?: () => void; expandable?: boolean; expanded?: boolean; onExpand?: () => void; draggable?: boolean; className?: string; headerActions?: React.ReactNode; }

export function DashboardPanel({ title, description, children, collapsible = false, defaultCollapsed = false, removable = false, onRemove, expandable = false, expanded = false, onExpand, draggable = false, className, headerActions }: DashboardPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const content = (
    <Card className={cn("", expanded && "fixed inset-4 z-50 overflow-auto", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          {draggable && <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />}
          <div><CardTitle className="text-base">{title}</CardTitle>{description && <CardDescription>{description}</CardDescription>}</div>
        </div>
        <div className="flex items-center gap-1">
          {headerActions}
          {collapsible && <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>{isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}</Button>}
          {expandable && <Button variant="ghost" size="icon" onClick={onExpand}>{expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}</Button>}
          {removable && <Button variant="ghost" size="icon" onClick={onRemove}><X className="h-4 w-4" /></Button>}
        </div>
      </CardHeader>
      {collapsible ? <Collapsible open={!isCollapsed}><CollapsibleContent><CardContent>{children}</CardContent></CollapsibleContent></Collapsible> : <CardContent>{children}</CardContent>}
    </Card>
  );
  return content;
}
export default DashboardPanel;
