import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps { title: string; description?: string; onGetStarted: () => void; className?: string; }

export function WelcomeScreen({ title, description, onGetStarted, className }: WelcomeScreenProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen text-center p-8", className)}>
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      {description && <p className="text-lg text-muted-foreground max-w-lg mb-8">{description}</p>}
      <Button size="lg" onClick={onGetStarted}>Começar</Button>
    </div>
  );
}
export default WelcomeScreen;
