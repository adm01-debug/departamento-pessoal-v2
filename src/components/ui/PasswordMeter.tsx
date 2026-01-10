import React from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface PasswordMeterProps { password: string; className?: string; }

export function PasswordMeter({ password, className }: PasswordMeterProps) {
  const getStrength = () => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };
  const strength = getStrength();
  const labels = ["Muito fraca", "Fraca", "Média", "Forte", "Muito forte"];
  return (
    <div className={cn("space-y-1", className)}>
      <Progress value={(strength / 4) * 100} className="h-2" />
      <p className="text-xs text-muted-foreground">{labels[strength]}</p>
    </div>
  );
}
export default PasswordMeter;
