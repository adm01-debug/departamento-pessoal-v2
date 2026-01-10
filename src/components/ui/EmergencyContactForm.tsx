import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmergencyContactFormProps { value: { phone: string; email: string; emergency: string }; onChange: (v: any) => void; className?: string; }

export function EmergencyContactForm({ value, onChange, className }: EmergencyContactFormProps) {
  const set = (k: string, v: string) => onChange({ ...value, [k]: v });
  return (
    <div className={cn("space-y-4", className)}>
      <div><Label>Telefone</Label><Input value={value.phone} onChange={(e) => set("phone", e.target.value)} /></div>
      <div><Label>Email</Label><Input type="email" value={value.email} onChange={(e) => set("email", e.target.value)} /></div>
      <div><Label>Contato Emergência</Label><Input value={value.emergency} onChange={(e) => set("emergency", e.target.value)} /></div>
    </div>
  );
}
export default EmergencyContactForm;
