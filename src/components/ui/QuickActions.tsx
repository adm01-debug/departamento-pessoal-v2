import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, X } from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  direction?: "vertical" | "horizontal";
}

export function QuickActions({ actions, className, position = "bottom-right", direction = "vertical" }: QuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  };

  const directionClasses = direction === "vertical" ? "flex-col-reverse" : "flex-row-reverse";

  return (
    <TooltipProvider>
      <div className={cn("fixed z-50 flex items-center gap-2", positionClasses[position], directionClasses, className)}>
        {isOpen && actions.map((action, index) => (
          <Tooltip key={action.id}>
            <TooltipTrigger asChild>
              <Button size="icon" className={cn("h-12 w-12 rounded-full shadow-lg transition-all", `animate-in fade-in zoom-in duration-200`)} style={{ backgroundColor: action.color, animationDelay: `${index * 50}ms` }} onClick={() => { action.onClick(); setIsOpen(false); }}>
                {action.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={direction === "vertical" ? "left" : "top"}>{action.label}</TooltipContent>
          </Tooltip>
        ))}
        <Button size="icon" className="h-14 w-14 rounded-full shadow-lg" onClick={() => setIsOpen(!isOpen)}>
          <Plus className={cn("h-6 w-6 transition-transform duration-200", isOpen && "rotate-45")} />
        </Button>
      </div>
    </TooltipProvider>
  );
}
export default QuickActions;
