import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
interface StatusBadgeProps { status: "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado"; }
const cfg = { ativo: "bg-green-100 text-green-800", inativo: "bg-gray-100 text-gray-800", pendente: "bg-yellow-100 text-yellow-800", aprovado: "bg-blue-100 text-blue-800", rejeitado: "bg-red-100 text-red-800" };
const labels = { ativo: "Ativo", inativo: "Inativo", pendente: "Pendente", aprovado: "Aprovado", rejeitado: "Rejeitado" };
export const StatusBadge = memo(function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge variant="outline" className={cn(cfg[status])}>{labels[status]}</Badge>;
});
