import { memo } from "react";
import { Badge } from "@/components/ui/badge";
interface StatusBadgeProps { status: "ativo" | "inativo" | "pendente" | "erro"; }
const cfg = { ativo: { label: "Ativo", variant: "default" as const }, inativo: { label: "Inativo", variant: "secondary" as const }, pendente: { label: "Pendente", variant: "outline" as const }, erro: { label: "Erro", variant: "destructive" as const } };
export const StatusBadge = memo(function StatusBadge({ status }: StatusBadgeProps) {
  const { label, variant } = cfg[status];
  return <Badge variant={variant}>{label}</Badge>;
});
