import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedBorderProps {
  children: React.ReactNode;
  borderWidth?: number;
  duration?: string;
  className?: string;
  gradientColors?: string[];
}

export function AnimatedBorder({ children, borderWidth = 2, duration = "4s", className, gradientColors = ["#3b82f6", "#8b5cf6", "#ec4899", "#3b82f6"] }: AnimatedBorderProps) {
  const gradient = `linear-gradient(90deg, ${gradientColors.join(", ")})`;
  return (
    <div className={cn("relative p-[2px] rounded-lg overflow-hidden", className)} style={{ padding: borderWidth }}>
      <div className="absolute inset-0 animate-border-spin" style={{ background: gradient, backgroundSize: "300% 300%" }} />
      <div className="relative bg-background rounded-lg h-full">{children}</div>
      <style>{`@keyframes border-spin { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } } .animate-border-spin { animation: border-spin ${duration} linear infinite; }`}</style>
    </div>
  );
}
export default AnimatedBorder;
