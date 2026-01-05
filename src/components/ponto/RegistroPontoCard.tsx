import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, Check } from "lucide-react";
interface RegistroPontoCardProps { registro: { data: string; diaSemana: string; entrada1?: string; saida1?: string; entrada2?: string; saida2?: string; horasTrabalhadas: string; horasExtras?: string; status: "OK" | "INCONSISTENCIA" | "FALTA" | "FERIADO" | "FOLGA" }; }
const statusConfig: Record<string, { color: string; bg: string }> = { OK: { color: "text-green-600", bg: "bg-green-50" }, INCONSISTENCIA: { color: "text-yellow-600", bg: "bg-yellow-50" }, FALTA: { color: "text-red-600", bg: "bg-red-50" }, FERIADO: { color: "text-blue-600", bg: "bg-blue-50" }, FOLGA: { color: "text-gray-600", bg: "bg-gray-50" } };
export function RegistroPontoCard({ registro }: RegistroPontoCardProps) {
  const config = statusConfig[registro.status];
  return (<Card className={config.bg}><CardContent className="p-3"><div className="flex items-center justify-between"><div><p className="font-medium">{registro.data}</p><p className="text-sm text-muted-foreground">{registro.diaSemana}</p></div><Badge variant="outline" className={config.color}>{registro.status}</Badge></div><div className="mt-3 grid grid-cols-4 gap-2 text-sm"><div><p className="text-xs text-muted-foreground">Entrada</p><p>{registro.entrada1 || "--:--"}</p></div><div><p className="text-xs text-muted-foreground">Saída</p><p>{registro.saida1 || "--:--"}</p></div><div><p className="text-xs text-muted-foreground">Retorno</p><p>{registro.entrada2 || "--:--"}</p></div><div><p className="text-xs text-muted-foreground">Saída</p><p>{registro.saida2 || "--:--"}</p></div></div><div className="mt-2 flex justify-between text-sm"><span>Trabalhadas: <strong>{registro.horasTrabalhadas}</strong></span>{registro.horasExtras && <span className="text-green-600">HE: {registro.horasExtras}</span>}</div></CardContent></Card>);
}
export default RegistroPontoCard;
