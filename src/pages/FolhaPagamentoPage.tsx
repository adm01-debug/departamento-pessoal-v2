import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload, Calculator, CheckCircle, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
export function FolhaPagamentoPage() {
  const [competencia] = useState("01/2025");
  return (
    <div className="container mx-auto p-6 space-y-6"><PageHeader title="Folha de Pagamento" description={`Competência ${competencia}`}><Button variant="outline"><Upload className="h-4 w-4 mr-2" />Importar Ponto</Button><Button><Calculator className="h-4 w-4 mr-2" />Calcular Folha</Button></PageHeader><div className="grid grid-cols-1 md:grid-cols-4 gap-4"><StatCard title="Colaboradores" value="150" icon={CheckCircle} /><StatCard title="Total Proventos" value="R$ 850.000" className="text-green-600" /><StatCard title="Total Descontos" value="R$ 150.000" className="text-red-600" /><StatCard title="Líquido" value="R$ 700.000" /></div><Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Status da Folha</CardTitle><Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Exportar</Button></CardHeader><CardContent><div className="grid grid-cols-1 md:grid-cols-5 gap-4"><div className="text-center p-4 bg-green-50 rounded-lg"><CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" /><p className="font-medium">Ponto</p><p className="text-sm text-muted-foreground">Importado</p></div><div className="text-center p-4 bg-green-50 rounded-lg"><CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" /><p className="font-medium">Lançamentos</p><p className="text-sm text-muted-foreground">Conferidos</p></div><div className="text-center p-4 bg-green-50 rounded-lg"><CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" /><p className="font-medium">Cálculo</p><p className="text-sm text-muted-foreground">Executado</p></div><div className="text-center p-4 bg-yellow-50 rounded-lg"><AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" /><p className="font-medium">Conferência</p><p className="text-sm text-muted-foreground">Pendente</p></div><div className="text-center p-4 bg-muted rounded-lg"><div className="h-8 w-8 mx-auto mb-2 rounded-full border-2" /><p className="font-medium">Fechamento</p><p className="text-sm text-muted-foreground">Aguardando</p></div></div></CardContent></Card></div>
  );
}
export default FolhaPagamentoPage;
