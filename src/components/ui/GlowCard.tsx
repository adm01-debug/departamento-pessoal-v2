import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface GlowCardProps {
  children: React.ReactNode;
  glowColor?: string;
  className?: string;
}

export function GlowCard({ children, glowColor = "rgba(59, 130, 246, 0.5)", className }: GlowCardProps) {
  return (
    <Card className={cn("relative group overflow-hidden", className)}>
      <div className="absolute -inset-0.5 rounded-lg opacity-0 group-hover:opacity-75 blur transition duration-500" style={{ background: glowColor }} />
      <div className="relative bg-card rounded-lg p-4">{children}</div>
    </Card>
  );
}
export default GlowCard;
