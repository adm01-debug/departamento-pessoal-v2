import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavItem { icon: LucideIcon; label: string; href: string; }
interface BottomNavigationProps { items: NavItem[]; currentPath: string; onNavigate: (href: string) => void; className?: string; }

export function BottomNavigation({ items, currentPath, onNavigate, className }: BottomNavigationProps) {
  return (
    <nav className={cn("fixed bottom-0 left-0 right-0 bg-background border-t flex justify-around py-2 px-4", className)}>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.href;
        return (
          <button key={item.href} className={cn("flex flex-col items-center gap-1 px-3 py-1", isActive ? "text-primary" : "text-muted-foreground")} onClick={() => onNavigate(item.href)}>
            <Icon className="h-5 w-5" />
            <span className="text-xs">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
export default BottomNavigation;
