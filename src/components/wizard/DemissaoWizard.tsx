import React, { useState } from "react";
import { Wizard } from "./Wizard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";
interface DemissaoWizardProps { colaborador: { id: string; nome: string; admissao: string }; onComplete: (data: any) => void; onCancel?: () => void; }
export function DemissaoWizard({ colaborador, onComplete, onCancel }: DemissaoWizardProps) {
  const [data, setData] = useState({ dataDemissao: "", tipo: "", motivo: "", avisoPrevio: "TRABALHADO" });
  const update = (field: string, value: any) => setData(prev => ({ ...prev, [field]: value }));
  const steps = [{ title: "Tipo de Rescisão", component: <div className="space-y-4"><div className="p-4 bg-yellow-50 rounded-lg flex gap-3"><AlertTriangle className="h-5 w-5 text-yellow-600" /><div><p className="font-medium">{colaborador.nome}</p><p className="text-sm text-muted-foreground">Admissão: {colaborador.admissao}</p></div></div><div><Label>Tipo de Demissão *</Label><Select value={data.tipo} onValueChange={v => update("tipo", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="SEM_JUSTA_CAUSA">Sem Justa Causa</SelectItem><SelectItem value="JUSTA_CAUSA">Justa Causa</SelectItem><SelectItem value="PEDIDO">Pedido de Demissão</SelectItem><SelectItem value="ACORDO">Acordo</SelectItem></SelectContent></Select></div></div>, isValid: !!data.tipo },
  { title: "Datas e Aviso", component: <div className="space-y-4"><div><Label>Data da Demissão *</Label><Input type="date" value={data.dataDemissao} onChange={e => update("dataDemissao", e.target.value)} /></div><div><Label>Aviso Prévio</Label><Select value={data.avisoPrevio} onValueChange={v => update("avisoPrevio", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="TRABALHADO">Trabalhado</SelectItem><SelectItem value="INDENIZADO">Indenizado</SelectItem><SelectItem value="DISPENSADO">Dispensado</SelectItem></SelectContent></Select></div></div>, isValid: !!data.dataDemissao },
  { title: "Motivo", component: <div><Label>Motivo da Demissão</Label><Textarea value={data.motivo} onChange={e => update("motivo", e.target.value)} rows={5} placeholder="Descreva o motivo..." /></div>, isValid: true },
  { title: "Confirmação", component: <div className="space-y-4"><div className="p-4 bg-red-50 rounded-lg"><p className="font-medium text-red-700">Confirmar Demissão</p><div className="mt-2 space-y-1 text-sm"><p><strong>Colaborador:</strong> {colaborador.nome}</p><p><strong>Tipo:</strong> {data.tipo}</p><p><strong>Data:</strong> {data.dataDemissao}</p><p><strong>Aviso:</strong> {data.avisoPrevio}</p></div></div></div>, isValid: true }];
  return <Wizard steps={steps} onComplete={() => onComplete({ ...data, colaboradorId: colaborador.id })} onCancel={onCancel} title="Processo de Demissão" />;
}
export default DemissaoWizard;
