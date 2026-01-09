import React from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  from?: string;
  via?: string;
  to?: string;
  direction?: "left" | "right" | "top" | "bottom";
  animate?: boolean;
  className?: string;
}

export function GradientText({ children, from = "#3b82f6", via, to = "#8b5cf6", direction = "right", animate = false, className }: GradientTextProps) {
  const directions = { left: "to left", right: "to right", top: "to top", bottom: "to bottom" };
  const gradient = via ? `linear-gradient(${directions[direction]}, ${from}, ${via}, ${to})` : `linear-gradient(${directions[direction]}, ${from}, ${to})`;

  return (
    <span className={cn("bg-clip-text text-transparent", animate && "animate-gradient bg-[length:200%_auto]", className)} style={{ backgroundImage: gradient }}>
      {children}
      {animate && <style>{`@keyframes gradient { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } } .animate-gradient { animation: gradient 3s ease infinite; }`}</style>}
    </span>
  );
}
export default GradientText;
