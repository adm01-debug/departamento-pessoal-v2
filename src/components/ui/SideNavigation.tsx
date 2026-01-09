import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface NavItem { icon: LucideIcon; label: string; href: string; badge?: number; }
interface SideNavigationProps { items: NavItem[]; currentPath: string; onNavigate: (href: string) => void; className?: string; }

export function SideNavigation({ items, currentPath, onNavigate, className }: SideNavigationProps) {
  return (
    <nav className={cn("space-y-1", className)}>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.href;
        return (
          <Button key={item.href} variant={isActive ? "secondary" : "ghost"} className={cn("w-full justify-start gap-3", isActive && "bg-secondary")} onClick={() => onNavigate(item.href)}>
            <Icon className="h-4 w-4" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge !== undefined && <span className="px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">{item.badge}</span>}
          </Button>
        );
      })}
    </nav>
  );
}
export default SideNavigation;
