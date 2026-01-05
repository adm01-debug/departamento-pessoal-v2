import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { useBeneficios } from "@/queries/beneficiosQueries";
import { BeneficioCard } from "@/components/beneficios/BeneficioCard";
import { Plus, Settings } from "lucide-react";
export function BeneficiosListPage() {
  const { data: beneficios, isLoading } = useBeneficios();
  return (<div className="space-y-6"><PageHeader title="Benefícios" description="Gestão de benefícios corporativos"><Button variant="outline"><Settings className="h-4 w-4 mr-2" />Configurar</Button><Button><Plus className="h-4 w-4 mr-2" />Novo Benefício</Button></PageHeader>{isLoading ? <div>Carregando...</div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{beneficios?.map(b => <BeneficioCard key={b.id} beneficio={{ ...b, beneficiarios: 0 }} />)}</div>}</div>);
}
export default BeneficiosListPage;
