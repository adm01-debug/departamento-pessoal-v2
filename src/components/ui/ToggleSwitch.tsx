import React from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ToggleSwitchProps { checked: boolean; onChange: (checked: boolean) => void; label?: string; description?: string; disabled?: boolean; className?: string; }

export function ToggleSwitch({ checked, onChange, label, description, disabled, className }: ToggleSwitchProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div>{label && <Label>{label}</Label>}{description && <p className="text-sm text-muted-foreground">{description}</p>}</div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}
export default ToggleSwitch;
