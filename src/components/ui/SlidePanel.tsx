import React from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

interface SlidePanelProps { open: boolean; onOpenChange: (open: boolean) => void; title: string; description?: string; side?: "left" | "right"; size?: "sm" | "md" | "lg"; children: React.ReactNode; }

export function SlidePanel({ open, onOpenChange, title, description, side = "right", size = "md", children }: SlidePanelProps) {
  const sizeClasses = { sm: "w-[300px]", md: "w-[400px]", lg: "w-[600px]" };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={side} className={cn(sizeClasses[size])}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="py-4">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
export default SlidePanel;
