import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Download, Filter } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { FilterBar } from "@/components/ui/filter-bar";
export function ColaboradoresPage() {
  const [search, setSearch] = useState("");
  return (
    <div className="container mx-auto p-6 space-y-6"><PageHeader title="Colaboradores" description="Gestão de colaboradores ativos e inativos"><Button variant="outline"><Download className="h-4 w-4 mr-2" />Exportar</Button><Button><Plus className="h-4 w-4 mr-2" />Novo Colaborador</Button></PageHeader><div className="grid grid-cols-1 md:grid-cols-4 gap-4"><Card><CardContent className="pt-6"><p className="text-2xl font-bold">150</p><p className="text-sm text-muted-foreground">Total Ativos</p></CardContent></Card><Card><CardContent className="pt-6"><p className="text-2xl font-bold text-green-600">5</p><p className="text-sm text-muted-foreground">Admissões (Mês)</p></CardContent></Card><Card><CardContent className="pt-6"><p className="text-2xl font-bold text-red-600">2</p><p className="text-sm text-muted-foreground">Demissões (Mês)</p></CardContent></Card><Card><CardContent className="pt-6"><p className="text-2xl font-bold text-blue-600">8</p><p className="text-sm text-muted-foreground">Em Férias</p></CardContent></Card></div><FilterBar onSearch={setSearch} placeholder="Buscar colaboradores..." filters={[{ key: "status", label: "Status", options: [{ value: "ativo", label: "Ativos" }, { value: "inativo", label: "Inativos" }, { value: "ferias", label: "Em Férias" }] }, { key: "departamento", label: "Departamento", options: [{ value: "ti", label: "TI" }, { value: "rh", label: "RH" }, { value: "comercial", label: "Comercial" }] }]} onFilter={() => {}} /><Card><CardHeader><CardTitle>Lista de Colaboradores</CardTitle></CardHeader><CardContent><div className="text-center py-8 text-muted-foreground">Nenhum colaborador encontrado</div></CardContent></Card></div>
  );
}
export default ColaboradoresPage;
