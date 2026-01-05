import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { RubricasTable } from "@/components/tables/RubricasTable";
import { Plus, Download } from "lucide-react";
const mockRubricas = [{ id: "1", codigo: "1001", descricao: "Salário Base", tipo: "PROVENTO" as const, natureza: "Salário", incideINSS: true, incideIRRF: true, incideFGTS: true, ativo: true }, { id: "2", codigo: "2001", descricao: "INSS Empregado", tipo: "DESCONTO" as const, natureza: "Contribuição", incideINSS: false, incideIRRF: false, incideFGTS: false, ativo: true }];
export function RubricasPage() {
  return (<div className="space-y-6"><PageHeader title="Rubricas" description="Cadastro de rubricas da folha de pagamento"><Button variant="outline"><Download className="h-4 w-4 mr-2" />Exportar</Button><Button><Plus className="h-4 w-4 mr-2" />Nova Rubrica</Button></PageHeader><Card><CardContent className="p-0"><RubricasTable data={mockRubricas} /></CardContent></Card></div>);
}
export default RubricasPage;
