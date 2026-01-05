import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> { showStrength?: boolean; }
export function PasswordInput({ className, showStrength = false, value, ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false);
  const getStrength = (val: string): { level: number; label: string; color: string } => { if (!val) return { level: 0, label: "", color: "" }; let score = 0; if (val.length >= 8) score++; if (/[A-Z]/.test(val)) score++; if (/[a-z]/.test(val)) score++; if (/\d/.test(val)) score++; if (/[^A-Za-z0-9]/.test(val)) score++; if (score <= 2) return { level: 1, label: "Fraca", color: "bg-red-500" }; if (score <= 3) return { level: 2, label: "Média", color: "bg-yellow-500" }; return { level: 3, label: "Forte", color: "bg-green-500" }; };
  const strength = showStrength ? getStrength(String(value || "")) : null;
  return (
    <div className="space-y-2"><div className="relative"><Input {...props} type={show ? "text" : "password"} value={value} className={cn("pr-10", className)} /><Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={() => setShow(!show)}>{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button></div>{showStrength && strength && strength.level > 0 && <div className="space-y-1"><div className="flex gap-1">{[1, 2, 3].map(i => <div key={i} className={cn("h-1 flex-1 rounded", i <= strength.level ? strength.color : "bg-muted")} />)}</div><p className="text-xs text-muted-foreground">Senha: {strength.label}</p></div>}</div>
  );
}
export default PasswordInput;
