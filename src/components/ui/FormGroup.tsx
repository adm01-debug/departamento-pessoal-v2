import React from "react";
import { cn } from "@/lib/utils";

interface FormGroupProps { title: string; description?: string; children: React.ReactNode; className?: string; }

export function FormGroup({ title, description, children, className }: FormGroupProps) {
  return (
    <div className={cn("space-y-4 pb-6 border-b last:border-0", className)}>
      <div><h3 className="text-lg font-medium">{title}</h3>{description && <p className="text-sm text-muted-foreground">{description}</p>}</div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
export default FormGroup;
