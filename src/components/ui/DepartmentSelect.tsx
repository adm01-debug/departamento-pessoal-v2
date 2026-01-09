import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2 } from "lucide-react";

interface Department { id: string; name: string; employeeCount?: number; }
interface DepartmentSelectProps { departments: Department[]; value?: string; onChange: (id: string) => void; label?: string; placeholder?: string; showCount?: boolean; disabled?: boolean; className?: string; }

export function DepartmentSelect({ departments, value, onChange, label, placeholder = "Selecionar departamento", showCount = false, disabled, className }: DepartmentSelectProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent>
          {departments.map((dept) => (
            <SelectItem key={dept.id} value={dept.id}>
              <div className="flex items-center justify-between w-full">
                <span>{dept.name}</span>
                {showCount && dept.employeeCount !== undefined && <span className="text-xs text-muted-foreground ml-2">({dept.employeeCount})</span>}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
export default DepartmentSelect;
