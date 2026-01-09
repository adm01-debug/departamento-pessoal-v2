import React from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface PasswordStrengthProps { password: string; className?: string; }

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[a-z]/.test(password)) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9!@#$%^&*]/.test(password)) score += 25;
    return score;
  };
  const strength = getStrength();
  const label = strength <= 25 ? "Fraca" : strength <= 50 ? "Média" : strength <= 75 ? "Boa" : "Forte";
  const color = strength <= 25 ? "bg-red-500" : strength <= 50 ? "bg-yellow-500" : strength <= 75 ? "bg-blue-500" : "bg-green-500";

  return (
    <div className={cn("space-y-1", className)}>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className={cn("h-full transition-all", color)} style={{ width: `${strength}%` }} />
      </div>
      <p className="text-xs text-muted-foreground">Força: {label}</p>
    </div>
  );
}
export default PasswordStrength;
