import React from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SwitchFieldProps { label: string; description?: string; checked: boolean; onCheckedChange: (checked: boolean) => void; disabled?: boolean; className?: string; }

export function SwitchField({ label, description, checked, onCheckedChange, disabled, className }: SwitchFieldProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="space-y-0.5">
        <Label className={cn(disabled && "text-muted-foreground")}>{label}</Label>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  );
}
export default SwitchField;
