import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
export function EventoPage({ folhaId }: { folhaId?: string }) {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div><h1 className="text-3xl font-bold">Eventos da Folha</h1><p className="text-muted-foreground">Lançamentos de proventos e descontos</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-600" />Proventos</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">R$ 0,00</p></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><TrendingDown className="w-4 h-4 text-red-600" />Descontos</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-600">R$ 0,00</p></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><DollarSign className="w-4 h-4" />Líquido</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">R$ 0,00</p></CardContent></Card></div>
      <Table><TableHeader><TableRow><TableHead>Rubrica</TableHead><TableHead>Tipo</TableHead><TableHead className="text-right">Ref.</TableHead><TableHead className="text-right">Valor</TableHead><TableHead>Origem</TableHead></TableRow></TableHeader><TableBody></TableBody></Table>
    </div>
  );
}
export default EventoPage;
