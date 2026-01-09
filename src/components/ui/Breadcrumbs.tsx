import React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem { label: string; href?: string; }
interface BreadcrumbsProps { items: BreadcrumbItem[]; showHome?: boolean; onNavigate?: (href: string) => void; className?: string; }

export function Breadcrumbs({ items, showHome = true, onNavigate, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex items-center gap-1 text-sm", className)}>
      {showHome && (
        <>
          <button className="text-muted-foreground hover:text-foreground" onClick={() => onNavigate?.("/")}><Home className="h-4 w-4" /></button>
          {items.length > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </>
      )}
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {item.href ? (
            <button className="text-muted-foreground hover:text-foreground" onClick={() => onNavigate?.(item.href!)}>{item.label}</button>
          ) : (
            <span className="font-medium">{item.label}</span>
          )}
          {i < items.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </React.Fragment>
      ))}
    </nav>
  );
}
export default Breadcrumbs;
