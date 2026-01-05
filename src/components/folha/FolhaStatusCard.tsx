import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Clock } from "lucide-react";
interface FolhaStatusProps { status: { ponto: "pendente" | "ok" | "erro"; lancamentos: "pendente" | "ok" | "erro"; calculo: "pendente" | "ok" | "erro"; conferencia: "pendente" | "ok" | "erro"; fechamento: "pendente" | "ok" | "erro"; }; }
const statusIcons = { pendente: <Circle className="h-5 w-5 text-muted-foreground" />, ok: <CheckCircle className="h-5 w-5 text-green-500" />, erro: <Clock className="h-5 w-5 text-red-500" /> };
const statusColors = { pendente: "bg-muted", ok: "bg-green-100", erro: "bg-red-100" };
export function FolhaStatusCard({ status }: FolhaStatusProps) {
  const steps = [{ key: "ponto", label: "Ponto" }, { key: "lancamentos", label: "Lançamentos" }, { key: "calculo", label: "Cálculo" }, { key: "conferencia", label: "Conferência" }, { key: "fechamento", label: "Fechamento" }];
  const completed = Object.values(status).filter(s => s === "ok").length;
  const progress = (completed / steps.length) * 100;
  return (
    <Card><CardHeader className="pb-2"><CardTitle className="text-base">Status da Folha</CardTitle><Progress value={progress} className="h-2 mt-2" /></CardHeader><CardContent><div className="grid grid-cols-5 gap-2">{steps.map(step => <div key={step.key} className={`text-center p-3 rounded-lg ${statusColors[status[step.key as keyof typeof status]]}`}>{statusIcons[status[step.key as keyof typeof status]]}<p className="text-xs mt-1">{step.label}</p></div>)}</div></CardContent></Card>
  );
}
export default FolhaStatusCard;
