import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WorkHoursInputProps { label?: string; entryTime?: string; exitTime?: string; onEntryChange?: (time: string) => void; onExitChange?: (time: string) => void; error?: string; disabled?: boolean; className?: string; }

export function WorkHoursInput({ label = "Horário de Trabalho", entryTime, exitTime, onEntryChange, onExitChange, error, disabled, className }: WorkHoursInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-2">
        <Input type="time" value={entryTime || ""} onChange={(e) => onEntryChange?.(e.target.value)} disabled={disabled} className="w-32" />
        <span className="text-muted-foreground">às</span>
        <Input type="time" value={exitTime || ""} onChange={(e) => onExitChange?.(e.target.value)} disabled={disabled} className="w-32" />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
export default WorkHoursInput;
