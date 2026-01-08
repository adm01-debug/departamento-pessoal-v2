import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDown, ChevronRight, PanelLeftClose, PanelLeft } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  badge?: string | number;
  children?: NavItem[];
  disabled?: boolean;
}

interface SidebarNavProps {
  items: NavItem[];
  className?: string;
  collapsed?: boolean;
  activeId?: string;
  onNavigate?: (item: NavItem) => void;
  onToggleCollapse?: (collapsed: boolean) => void;
}

function NavItemComponent({ item, collapsed, activeId, level = 0, onNavigate }: { item: NavItem; collapsed: boolean; activeId?: string; level?: number; onNavigate?: (item: NavItem) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = activeId === item.id;

  const content = (
    <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors", isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted", item.disabled && "opacity-50 cursor-not-allowed")} style={{ paddingLeft: `${level * 12 + 12}px` }} onClick={() => {
      if (item.disabled) return;
      if (hasChildren) setIsExpanded(!isExpanded);
      else onNavigate?.(item);
    }}>
      {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && <span className={cn("px-1.5 py-0.5 text-xs rounded-full", isActive ? "bg-primary-foreground text-primary" : "bg-muted-foreground/20")}>{item.badge}</span>}
          {hasChildren && (isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
        </>
      )}
    </div>
  );

  return (
    <div>
      {collapsed && item.icon ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : content}
      {hasChildren && isExpanded && !collapsed && (
        <div className="mt-1">
          {item.children!.map(child => (
            <NavItemComponent key={child.id} item={child} collapsed={collapsed} activeId={activeId} level={level + 1} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
}

export function SidebarNav({ items, className, collapsed = false, activeId, onNavigate, onToggleCollapse }: SidebarNavProps) {
  return (
    <div className={cn("flex flex-col h-full bg-card border-r transition-all", collapsed ? "w-16" : "w-64", className)}>
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && <span className="font-semibold">Menu</span>}
        {onToggleCollapse && (
          <Button variant="ghost" size="icon" onClick={() => onToggleCollapse(!collapsed)}>
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 p-2">
        <nav className="space-y-1">
          {items.map(item => (
            <NavItemComponent key={item.id} item={item} collapsed={collapsed} activeId={activeId} onNavigate={onNavigate} />
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}
export default SidebarNav;
