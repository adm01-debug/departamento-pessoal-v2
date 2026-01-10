import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface IconFeatureCardProps { icon: LucideIcon; title: string; description: string; className?: string; }

export function IconFeatureCard({ icon: Icon, title, description, className }: IconFeatureCardProps) {
  return (
    <div className={cn("p-6 border rounded-lg text-center", className)}>
      <div className="h-12 w-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center"><Icon className="h-6 w-6 text-primary" /></div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
export default IconFeatureCard;
