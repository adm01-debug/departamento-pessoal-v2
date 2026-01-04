import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface MenuItem { id: string; label: string; icon?: LucideIcon; badge?: number; href?: string; children?: MenuItem[]; }
interface DashboardSidebarProps { items: MenuItem[]; activeId?: string; onSelect?: (id: string) => void; collapsed?: boolean; onToggle?: () => void; header?: React.ReactNode; footer?: React.ReactNode; className?: string; }

export function DashboardSidebar({ items, activeId, onSelect, collapsed = false, onToggle, header, footer, className }: DashboardSidebarProps) {
  const renderItem = (item: MenuItem, level = 0) => {
    const Icon = item.icon;
    const isActive = activeId === item.id;
    return (
      <div key={item.id}>
        <Button variant={isActive ? "secondary" : "ghost"} className={cn("w-full justify-start", collapsed ? "px-2" : "px-3", level > 0 && "ml-4")} onClick={() => onSelect?.(item.id)}>
          {Icon && <Icon className={cn("h-4 w-4", !collapsed && "mr-2")} />}
          {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
          {!collapsed && item.badge !== undefined && <Badge variant="secondary">{item.badge}</Badge>}
        </Button>
        {item.children && !collapsed && item.children.map(child => renderItem(child, level + 1))}
      </div>
    );
  };
  return (
    <aside className={cn("flex flex-col border-r bg-background transition-all", collapsed ? "w-16" : "w-64", className)}>
      {header && <div className="p-4 border-b">{header}</div>}
      <ScrollArea className="flex-1"><div className="p-2 space-y-1">{items.map(item => renderItem(item))}</div></ScrollArea>
      {footer && <><Separator /><div className="p-4">{footer}</div></>}
      {onToggle && <Button variant="ghost" size="sm" className="m-2" onClick={onToggle}>{collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}</Button>}
    </aside>
  );
}
export default DashboardSidebar;
