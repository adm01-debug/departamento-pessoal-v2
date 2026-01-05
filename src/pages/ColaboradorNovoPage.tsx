import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
export function ColaboradorNovoPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  return (<div className="space-y-6"><PageHeader title="Nova Admissão" description="Cadastre um novo colaborador"><Button variant="outline" onClick={() => navigate("/colaboradores")}>Cancelar</Button></PageHeader><Card><CardHeader><CardTitle>Dados Pessoais</CardTitle></CardHeader><CardContent><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><Label>Nome Completo *</Label><Input placeholder="Nome completo" /></div><div><Label>CPF *</Label><Input placeholder="000.000.000-00" /></div><div><Label>RG</Label><Input placeholder="RG" /></div><div><Label>Data Nascimento</Label><Input type="date" /></div><div><Label>Email</Label><Input type="email" placeholder="email@exemplo.com" /></div><div><Label>Telefone</Label><Input placeholder="(00) 00000-0000" /></div></div></CardContent></Card><Card><CardHeader><CardTitle>Dados do Contrato</CardTitle></CardHeader><CardContent><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><Label>Data Admissão *</Label><Input type="date" /></div><div><Label>Salário Base *</Label><Input type="number" placeholder="0,00" /></div><div><Label>Cargo</Label><Input placeholder="Cargo" /></div><div><Label>Departamento</Label><Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="ti">TI</SelectItem><SelectItem value="rh">RH</SelectItem><SelectItem value="comercial">Comercial</SelectItem></SelectContent></Select></div></div></CardContent></Card><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => navigate("/colaboradores")}>Cancelar</Button><Button><UserPlus className="h-4 w-4 mr-2" />Cadastrar</Button></div></div>);
}
export default ColaboradorNovoPage;
