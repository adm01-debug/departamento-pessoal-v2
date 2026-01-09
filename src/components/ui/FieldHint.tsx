import React from "react";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface FieldHintProps { message: string; className?: string; }

export function FieldHint({ message, className }: FieldHintProps) {
  return <p className={cn("text-sm text-muted-foreground flex items-center gap-1 mt-1", className)}><Info className="h-3 w-3" />{message}</p>;
}
export default FieldHint;
