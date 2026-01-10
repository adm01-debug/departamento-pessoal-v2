import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SupportFormProps { onSubmit: (data: { name: string; email: string; message: string }) => void; loading?: boolean; className?: string; }

export function SupportForm({ onSubmit, loading, className }: SupportFormProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  return (
    <form className={cn("space-y-4", className)} onSubmit={(e) => { e.preventDefault(); onSubmit({ name, email, message }); }}>
      <div><Label>Nome</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
      <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div><Label>Mensagem</Label><Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} /></div>
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Enviando..." : "Enviar"}</Button>
    </form>
  );
}
export default SupportForm;
