import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Building2, Calendar, DollarSign, Phone, Mail } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
interface ColaboradorCardProps { colaborador: { id: string; nome: string; cpf: string; cargo: string; departamento: string; dataAdmissao: string; salario: number; status: string; email?: string; telefone?: string; avatar?: string }; onClick?: () => void; }
const statusColors: Record<string, string> = { ATIVO: "bg-green-100 text-green-800", INATIVO: "bg-gray-100 text-gray-800", FERIAS: "bg-blue-100 text-blue-800", AFASTADO: "bg-yellow-100 text-yellow-800" };
export function ColaboradorCard({ colaborador, onClick }: ColaboradorCardProps) {
  return (<Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}><CardContent className="p-4"><div className="flex items-start gap-4"><UserAvatar name={colaborador.nome} image={colaborador.avatar} size="lg" /><div className="flex-1"><div className="flex items-center justify-between"><h3 className="font-semibold">{colaborador.nome}</h3><Badge className={statusColors[colaborador.status]}>{colaborador.status}</Badge></div><div className="mt-2 space-y-1 text-sm text-muted-foreground"><div className="flex items-center gap-2"><Building2 className="h-4 w-4" />{colaborador.cargo} - {colaborador.departamento}</div><div className="flex items-center gap-2"><Calendar className="h-4 w-4" />Admissão: {colaborador.dataAdmissao}</div><div className="flex items-center gap-2"><DollarSign className="h-4 w-4" />R$ {colaborador.salario.toLocaleString()}</div>{colaborador.email && <div className="flex items-center gap-2"><Mail className="h-4 w-4" />{colaborador.email}</div>}</div></div></div></CardContent></Card>);
}
export default ColaboradorCard;
