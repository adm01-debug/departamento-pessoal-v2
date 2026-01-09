import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  variant?: "default" | "centered" | "horizontal";
}

export function FeatureCard({ icon, title, description, className, variant = "default" }: FeatureCardProps) {
  if (variant === "horizontal") {
    return (
      <Card className={cn("hover:shadow-md transition-shadow", className)}>
        <CardContent className="flex items-start gap-4 p-6">
          <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">{icon}</div>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className={cn("p-6", variant === "centered" && "text-center")}>
        <div className={cn("h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary", variant === "centered" && "mx-auto")}>{icon}</div>
        <h3 className="font-semibold mt-4">{title}</h3>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
      </CardContent>
    </Card>
  );
}
export default FeatureCard;
