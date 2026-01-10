import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ResetPasswordFormProps { onSubmit: (data: { password: string; confirmPassword: string }) => void; loading?: boolean; className?: string; }

export function ResetPasswordForm({ onSubmit, loading, className }: ResetPasswordFormProps) {
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  return (
    <form className={cn("space-y-4", className)} onSubmit={(e) => { e.preventDefault(); onSubmit({ password, confirmPassword }); }}>
      <div><Label>Nova Senha</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      <div><Label>Confirmar Senha</Label><Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Redefinindo..." : "Redefinir"}</Button>
    </form>
  );
}
export default ResetPasswordForm;
