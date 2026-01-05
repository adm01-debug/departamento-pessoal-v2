import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface FichaRegistroProps { colaborador: { nome: string; cpf: string; rg: string; dataNascimento: string; endereco: string; cargo: string; departamento: string; dataAdmissao: string; salario: number; ctps: string; pis: string }; }
export function FichaRegistro({ colaborador }: FichaRegistroProps) {
  return (
    <Card className="print:break-inside-avoid">
      <CardHeader><CardTitle>Ficha de Registro do Empregado</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><span className="text-xs text-muted-foreground">Nome Completo</span><p className="font-medium">{colaborador.nome}</p></div>
          <div><span className="text-xs text-muted-foreground">CPF</span><p className="font-medium">{colaborador.cpf}</p></div>
          <div><span className="text-xs text-muted-foreground">RG</span><p className="font-medium">{colaborador.rg}</p></div>
          <div><span className="text-xs text-muted-foreground">Data Nascimento</span><p className="font-medium">{colaborador.dataNascimento}</p></div>
          <div className="col-span-2"><span className="text-xs text-muted-foreground">Endereço</span><p className="font-medium">{colaborador.endereco}</p></div>
          <div><span className="text-xs text-muted-foreground">Cargo</span><p className="font-medium">{colaborador.cargo}</p></div>
          <div><span className="text-xs text-muted-foreground">Departamento</span><p className="font-medium">{colaborador.departamento}</p></div>
          <div><span className="text-xs text-muted-foreground">Data Admissão</span><p className="font-medium">{colaborador.dataAdmissao}</p></div>
          <div><span className="text-xs text-muted-foreground">Salário</span><p className="font-medium">R$ {colaborador.salario.toFixed(2)}</p></div>
          <div><span className="text-xs text-muted-foreground">CTPS</span><p className="font-medium">{colaborador.ctps}</p></div>
          <div><span className="text-xs text-muted-foreground">PIS/NIT</span><p className="font-medium">{colaborador.pis}</p></div>
        </div>
      </CardContent>
    </Card>
  );
}
export default FichaRegistro;
