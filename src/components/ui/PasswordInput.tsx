import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Eye, EyeOff, Check, X } from "lucide-react";

interface PasswordInputProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  showStrength?: boolean;
  showRequirements?: boolean;
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecial?: boolean;
}

export function PasswordInput({ value = "", onChange, className, placeholder = "Senha", showStrength = false, showRequirements = false, minLength = 8, requireUppercase = true, requireLowercase = true, requireNumbers = true, requireSpecial = false }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const requirements = [
    { label: `Mínimo ${minLength} caracteres`, met: value.length >= minLength },
    ...(requireUppercase ? [{ label: "Letra maiúscula", met: /[A-Z]/.test(value) }] : []),
    ...(requireLowercase ? [{ label: "Letra minúscula", met: /[a-z]/.test(value) }] : []),
    ...(requireNumbers ? [{ label: "Número", met: /[0-9]/.test(value) }] : []),
    ...(requireSpecial ? [{ label: "Caractere especial", met: /[!@#$%^&*(),.?":{}|<>]/.test(value) }] : []),
  ];

  const metCount = requirements.filter(r => r.met).length;
  const strength = (metCount / requirements.length) * 100;

  const getStrengthColor = () => {
    if (strength < 33) return "bg-red-500";
    if (strength < 66) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthLabel = () => {
    if (strength < 33) return "Fraca";
    if (strength < 66) return "Média";
    return "Forte";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative">
        <Input type={showPassword ? "text" : "password"} value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} className="pr-10" />
        <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
      {showStrength && value && (
        <div className="space-y-1">
          <Progress value={strength} className={cn("h-1", getStrengthColor())} />
          <p className="text-xs text-muted-foreground">Força: {getStrengthLabel()}</p>
        </div>
      )}
      {showRequirements && value && (
        <ul className="space-y-1">
          {requirements.map((req, i) => (
            <li key={i} className={cn("flex items-center gap-2 text-xs", req.met ? "text-green-600" : "text-muted-foreground")}>
              {req.met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
              {req.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default PasswordInput;
