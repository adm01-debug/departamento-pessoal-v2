import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { LotacaoCard } from "@/components/lotacao/LotacaoCard";
import { Plus } from "lucide-react";
const mockLotacoes = [{ id: "1", codigo: "L001", descricao: "Matriz", tipo: "FILIAL", codigoContabil: "1.1.01", centroCusto: "CC001", endereco: "Av. Principal, 1000", ativo: true }, { id: "2", codigo: "L002", descricao: "Filial SP", tipo: "FILIAL", codigoContabil: "1.1.02", centroCusto: "CC002", endereco: "Rua Augusta, 500", ativo: true }];
export function LotacoesPage() {
  return (<div className="space-y-6"><PageHeader title="Lotações" description="Cadastro de lotações e locais de trabalho"><Button><Plus className="h-4 w-4 mr-2" />Nova Lotação</Button></PageHeader><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{mockLotacoes.map(l => <LotacaoCard key={l.id} lotacao={l} />)}</div></div>);
}
export default LotacoesPage;
