import React, { useState } from "react";
import { Wizard } from "./Wizard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
interface AdmissaoWizardProps { onComplete: (data: any) => void; onCancel?: () => void; }
export function AdmissaoWizard({ onComplete, onCancel }: AdmissaoWizardProps) {
  const [data, setData] = useState({ nome: "", cpf: "", email: "", dataAdmissao: "", cargo: "", departamento: "", salario: 0 });
  const update = (field: string, value: any) => setData(prev => ({ ...prev, [field]: value }));
  const steps = [{ title: "Dados Pessoais", component: <div className="space-y-4"><div><Label>Nome Completo *</Label><Input value={data.nome} onChange={e => update("nome", e.target.value)} /></div><div><Label>CPF *</Label><Input value={data.cpf} onChange={e => update("cpf", e.target.value)} /></div><div><Label>Email</Label><Input type="email" value={data.email} onChange={e => update("email", e.target.value)} /></div></div>, isValid: data.nome.length >= 3 && data.cpf.length === 11 },
  { title: "Dados do Contrato", component: <div className="space-y-4"><div><Label>Data de Admissão *</Label><Input type="date" value={data.dataAdmissao} onChange={e => update("dataAdmissao", e.target.value)} /></div><div><Label>Salário Base *</Label><Input type="number" value={data.salario} onChange={e => update("salario", parseFloat(e.target.value))} /></div></div>, isValid: !!data.dataAdmissao && data.salario > 0 },
  { title: "Lotação", component: <div className="space-y-4"><div><Label>Cargo</Label><Input value={data.cargo} onChange={e => update("cargo", e.target.value)} /></div><div><Label>Departamento</Label><Select value={data.departamento} onValueChange={v => update("departamento", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="ti">TI</SelectItem><SelectItem value="rh">RH</SelectItem><SelectItem value="comercial">Comercial</SelectItem></SelectContent></Select></div></div>, isValid: true },
  { title: "Confirmação", component: <div className="space-y-2 bg-muted p-4 rounded-lg"><p><strong>Nome:</strong> {data.nome}</p><p><strong>CPF:</strong> {data.cpf}</p><p><strong>Admissão:</strong> {data.dataAdmissao}</p><p><strong>Salário:</strong> R$ {data.salario?.toFixed(2)}</p><p><strong>Cargo:</strong> {data.cargo}</p><p><strong>Departamento:</strong> {data.departamento}</p></div>, isValid: true }];
  return <Wizard steps={steps} onComplete={() => onComplete(data)} onCancel={onCancel} title="Nova Admissão" />;
}
export default AdmissaoWizard;
