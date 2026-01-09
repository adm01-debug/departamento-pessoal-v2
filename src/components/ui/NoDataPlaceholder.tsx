import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon, Inbox } from "lucide-react";

interface NoDataPlaceholderProps { icon?: LucideIcon; title: string; description?: string; actionLabel?: string; onAction?: () => void; className?: string; }

export function NoDataPlaceholder({ icon: Icon = Inbox, title, description, actionLabel, onAction, className }: NoDataPlaceholderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4"><Icon className="h-8 w-8 text-muted-foreground" /></div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>}
      {actionLabel && onAction && <Button onClick={onAction}>{actionLabel}</Button>}
    </div>
  );
}
export default NoDataPlaceholder;
