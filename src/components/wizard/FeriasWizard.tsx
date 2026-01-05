import React, { useState } from "react";
import { Wizard } from "./Wizard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "lucide-react";
interface FeriasWizardProps { colaborador: { id: string; nome: string; diasDisponiveis: number; periodoAquisitivo: string }; onComplete: (data: any) => void; onCancel?: () => void; }
export function FeriasWizard({ colaborador, onComplete, onCancel }: FeriasWizardProps) {
  const [data, setData] = useState({ dataInicio: "", diasGozo: 30, diasAbono: 0, adiantamento13: false });
  const update = (field: string, value: any) => setData(prev => ({ ...prev, [field]: value }));
  const dataFim = data.dataInicio ? new Date(new Date(data.dataInicio).getTime() + (data.diasGozo - 1) * 86400000).toISOString().split("T")[0] : "";
  const steps = [{ title: "Período de Gozo", component: <div className="space-y-4"><div className="p-4 bg-blue-50 rounded-lg flex gap-3"><Calendar className="h-5 w-5 text-blue-600" /><div><p className="font-medium">{colaborador.nome}</p><p className="text-sm">Período Aquisitivo: {colaborador.periodoAquisitivo}</p><p className="text-sm">Dias Disponíveis: {colaborador.diasDisponiveis}</p></div></div><div><Label>Data de Início *</Label><Input type="date" value={data.dataInicio} onChange={e => update("dataInicio", e.target.value)} /></div><div><Label>Dias de Gozo (5-30)</Label><Input type="number" min={5} max={30} value={data.diasGozo} onChange={e => update("diasGozo", parseInt(e.target.value))} /></div>{dataFim && <p className="text-sm text-muted-foreground">Data de retorno: {dataFim}</p>}</div>, isValid: !!data.dataInicio && data.diasGozo >= 5 },
  { title: "Abono e Extras", component: <div className="space-y-4"><div><Label>Dias de Abono Pecuniário (0-10)</Label><Input type="number" min={0} max={10} value={data.diasAbono} onChange={e => update("diasAbono", parseInt(e.target.value))} /></div><div className="flex items-center gap-2"><Switch checked={data.adiantamento13} onCheckedChange={v => update("adiantamento13", v)} /><Label>Adiantamento 13º Salário</Label></div><div className="p-4 bg-green-50 rounded-lg mt-4"><p className="font-medium">Resumo</p><p className="text-sm">Dias de Gozo: {data.diasGozo}</p><p className="text-sm">Dias de Abono: {data.diasAbono}</p><p className="text-sm">Total: {data.diasGozo + data.diasAbono} dias</p></div></div>, isValid: data.diasGozo + data.diasAbono <= 30 },
  { title: "Confirmação", component: <div className="space-y-2 bg-muted p-4 rounded-lg"><p><strong>Colaborador:</strong> {colaborador.nome}</p><p><strong>Início:</strong> {data.dataInicio}</p><p><strong>Fim:</strong> {dataFim}</p><p><strong>Dias Gozo:</strong> {data.diasGozo}</p><p><strong>Dias Abono:</strong> {data.diasAbono}</p><p><strong>Adiant. 13º:</strong> {data.adiantamento13 ? "Sim" : "Não"}</p></div>, isValid: true }];
  return <Wizard steps={steps} onComplete={() => onComplete({ ...data, colaboradorId: colaborador.id, dataFim })} onCancel={onCancel} title="Programar Férias" />;
}
export default FeriasWizard;
