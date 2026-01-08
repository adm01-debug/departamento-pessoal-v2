import React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, Home, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  current?: boolean;
}

interface BreadcrumbsAdvancedProps {
  items: BreadcrumbItem[];
  className?: string;
  maxItems?: number;
  separator?: React.ReactNode;
  showHome?: boolean;
  homeHref?: string;
  onNavigate?: (href: string) => void;
}

export function BreadcrumbsAdvanced({ items, className, maxItems = 4, separator, showHome = true, homeHref = "/", onNavigate }: BreadcrumbsAdvancedProps) {
  const handleClick = (href?: string) => {
    if (href && onNavigate) onNavigate(href);
  };

  const renderItem = (item: BreadcrumbItem, isLast: boolean) => (
    <span className={cn("flex items-center gap-1", isLast ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground cursor-pointer")} onClick={() => !isLast && handleClick(item.href)}>
      {item.icon}
      <span className="truncate max-w-[150px]">{item.label}</span>
    </span>
  );

  const visibleItems = items.length <= maxItems ? items : [...items.slice(0, 1), { label: "...", items: items.slice(1, -2) } as any, ...items.slice(-2)];

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1 text-sm", className)}>
      {showHome && (
        <>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleClick(homeHref)}>
            <Home className="h-4 w-4" />
          </Button>
          {separator || <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </>
      )}
      {visibleItems.map((item, index) => {
        const isLast = index === visibleItems.length - 1;
        
        if ((item as any).items) {
          return (
            <React.Fragment key="collapsed">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {(item as any).items.map((subItem: BreadcrumbItem, i: number) => (
                    <DropdownMenuItem key={i} onClick={() => handleClick(subItem.href)}>
                      {subItem.icon}
                      {subItem.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {separator || <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </React.Fragment>
          );
        }

        return (
          <React.Fragment key={index}>
            {renderItem(item, isLast)}
            {!isLast && (separator || <ChevronRight className="h-4 w-4 text-muted-foreground" />)}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
export default BreadcrumbsAdvanced;
