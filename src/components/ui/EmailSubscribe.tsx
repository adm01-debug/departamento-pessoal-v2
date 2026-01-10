import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EmailSubscribeProps { onSubmit: (email: string) => void; loading?: boolean; className?: string; }

export function EmailSubscribe({ onSubmit, loading, className }: EmailSubscribeProps) {
  const [email, setEmail] = React.useState("");
  return (
    <div className={cn("flex gap-2", className)}>
      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
      <Button onClick={() => onSubmit(email)} disabled={loading || !email}>{loading ? "Enviando..." : "Inscrever"}</Button>
    </div>
  );
}
export default EmailSubscribe;
