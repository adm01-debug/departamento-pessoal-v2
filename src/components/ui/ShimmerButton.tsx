import React from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";

interface ShimmerButtonProps extends ButtonProps {
  shimmerColor?: string;
  shimmerDuration?: string;
}

export function ShimmerButton({ className, shimmerColor = "rgba(255,255,255,0.2)", shimmerDuration = "2s", children, ...props }: ShimmerButtonProps) {
  return (
    <Button className={cn("relative overflow-hidden", className)} {...props}>
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 -translate-x-full animate-shimmer" style={{ background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`, animationDuration: shimmerDuration }} />
      <style>{`@keyframes shimmer { 100% { transform: translateX(100%); } } .animate-shimmer { animation: shimmer infinite; }`}</style>
    </Button>
  );
}
export default ShimmerButton;
