import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ForgotPasswordFormProps { onSubmit: (email: string) => void; loading?: boolean; className?: string; }

export function ForgotPasswordForm({ onSubmit, loading, className }: ForgotPasswordFormProps) {
  const [email, setEmail] = React.useState("");
  return (
    <form className={cn("space-y-4", className)} onSubmit={(e) => { e.preventDefault(); onSubmit(email); }}>
      <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" /></div>
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Enviando..." : "Enviar link"}</Button>
    </form>
  );
}
export default ForgotPasswordForm;
