import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface FieldErrorProps { message?: string; className?: string; }

export function FieldError({ message, className }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p className={cn("text-sm text-destructive flex items-center gap-1 mt-1", className)}>
      <AlertCircle className="h-3 w-3" />
      {message}
    </p>
  );
}
export default FieldError;
