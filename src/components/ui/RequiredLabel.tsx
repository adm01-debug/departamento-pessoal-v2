import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface RequiredLabelProps { htmlFor?: string; required?: boolean; children: React.ReactNode; className?: string; }

export function RequiredLabel({ htmlFor, required = true, children, className }: RequiredLabelProps) {
  return (
    <Label htmlFor={htmlFor} className={className}>
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </Label>
  );
}
export default RequiredLabel;
