import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface NavItem { id: string; label: string; icon?: LucideIcon; badge?: number; disabled?: boolean; }
interface DashboardNavProps { items: NavItem[]; activeId: string; onChange: (id: string) => void; variant?: "tabs" | "pills" | "underline"; className?: string; }

export function DashboardNav({ items, activeId, onChange, variant = "tabs", className }: DashboardNavProps) {
  const baseClasses = "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors";
  const variantClasses = {
    tabs: { active: "bg-background border-b-2 border-primary text-primary", inactive: "text-muted-foreground hover:text-foreground" },
    pills: { active: "bg-primary text-primary-foreground rounded-full", inactive: "text-muted-foreground hover:bg-muted rounded-full" },
    underline: { active: "border-b-2 border-primary text-primary", inactive: "text-muted-foreground hover:text-foreground" },
  };
  return (
    <nav className={cn("flex gap-1", variant === "tabs" && "border-b", className)}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button key={item.id} onClick={() => !item.disabled && onChange(item.id)} disabled={item.disabled}
            className={cn(baseClasses, activeId === item.id ? variantClasses[variant].active : variantClasses[variant].inactive, item.disabled && "opacity-50 cursor-not-allowed")}>
            {Icon && <Icon className="h-4 w-4" />}{item.label}
            {item.badge !== undefined && item.badge > 0 && <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">{item.badge}</Badge>}
          </button>
        );
      })}
    </nav>
  );
}
export default DashboardNav;
