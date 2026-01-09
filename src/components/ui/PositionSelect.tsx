import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase } from "lucide-react";

interface Position { id: string; name: string; level?: string; }
interface PositionSelectProps { positions: Position[]; value?: string; onChange: (id: string) => void; label?: string; placeholder?: string; disabled?: boolean; className?: string; }

export function PositionSelect({ positions, value, onChange, label, placeholder = "Selecionar cargo", disabled, className }: PositionSelectProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent>
          {positions.map((pos) => (
            <SelectItem key={pos.id} value={pos.id}>
              <div><span>{pos.name}</span>{pos.level && <span className="text-xs text-muted-foreground ml-2">({pos.level})</span>}</div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
export default PositionSelect;
