import React from "react";
import { cn } from "@/lib/utils";

interface FormRowProps { children: React.ReactNode; columns?: 1 | 2 | 3 | 4; className?: string; }

export function FormRow({ children, columns = 2, className }: FormRowProps) {
  const cols = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" };
  return <div className={cn("grid gap-4", cols[columns], className)}>{children}</div>;
}
export default FormRow;
