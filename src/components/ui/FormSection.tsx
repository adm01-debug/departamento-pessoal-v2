import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FormSectionProps { title: string; description?: string; children: React.ReactNode; variant?: "default" | "card"; className?: string; }

export function FormSection({ title, description, children, variant = "default", className }: FormSectionProps) {
  if (variant === "card") {
    return (
      <Card className={className}>
        <CardHeader><CardTitle className="text-base">{title}</CardTitle>{description && <CardDescription>{description}</CardDescription>}</CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    );
  }
  return (
    <div className={cn("space-y-4", className)}>
      <div><h3 className="font-medium">{title}</h3>{description && <p className="text-sm text-muted-foreground">{description}</p>}</div>
      {children}
    </div>
  );
}
export default FormSection;
