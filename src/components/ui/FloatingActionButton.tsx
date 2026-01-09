import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon, Plus } from "lucide-react";

interface FloatingActionButtonProps { icon?: LucideIcon; onClick: () => void; position?: "bottom-right" | "bottom-left" | "bottom-center"; className?: string; }

const positions = { "bottom-right": "bottom-6 right-6", "bottom-left": "bottom-6 left-6", "bottom-center": "bottom-6 left-1/2 -translate-x-1/2" };

export function FloatingActionButton({ icon: Icon = Plus, onClick, position = "bottom-right", className }: FloatingActionButtonProps) {
  return (
    <Button size="icon" className={cn("fixed h-14 w-14 rounded-full shadow-lg", positions[position], className)} onClick={onClick}>
      <Icon className="h-6 w-6" />
    </Button>
  );
}
export default FloatingActionButton;
