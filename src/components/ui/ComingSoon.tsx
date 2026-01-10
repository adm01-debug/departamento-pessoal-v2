import React from "react";
import { cn } from "@/lib/utils";
import { Rocket } from "lucide-react";

interface ComingSoonProps { title?: string; description?: string; className?: string; }

export function ComingSoon({ title = "Em Breve", description = "Novidades em breve!", className }: ComingSoonProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[400px] text-center p-4", className)}>
      <Rocket className="h-16 w-16 text-primary mb-4" />
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground max-w-md">{description}</p>
    </div>
  );
}
export default ComingSoon;
