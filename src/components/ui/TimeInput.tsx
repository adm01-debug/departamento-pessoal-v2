import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";

interface TimeInputProps { value: string; onChange: (value: string) => void; className?: string; }

export function TimeInput({ value, onChange, className }: TimeInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input type="time" value={value} onChange={(e) => onChange(e.target.value)} className="pl-10" />
    </div>
  );
}
export default TimeInput;
