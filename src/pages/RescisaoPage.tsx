import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Calculator } from "lucide-react";
export function RescisaoPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center"><div><h1 className="text-3xl font-bold">Rescisões Contratuais</h1><p className="text-muted-foreground">Cálculos e pagamentos rescisórios</p></div></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Calculator className="w-4 h-4" />Pendentes</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-yellow-600">0</p></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><DollarSign className="w-4 h-4" />Pagas (Mês)</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">0</p></CardContent></Card></div>
    </div>
  );
}
export default RescisaoPage;
