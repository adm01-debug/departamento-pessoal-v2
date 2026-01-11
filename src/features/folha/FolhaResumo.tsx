// V15-505
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/formatters/currency';
import { Users, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
interface FolhaResumoProps { totalColaboradores: number; totalProventos: number; totalDescontos: number; totalLiquido: number; }
export function FolhaResumo({ totalColaboradores, totalProventos, totalDescontos, totalLiquido }: FolhaResumoProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4 mb-6">
      <Card><CardContent className="pt-6 flex items-center gap-4"><Users className="h-8 w-8 text-primary" /><div><p className="text-sm text-muted-foreground">Colaboradores</p><p className="text-2xl font-bold">{totalColaboradores}</p></div></CardContent></Card>
      <Card><CardContent className="pt-6 flex items-center gap-4"><TrendingUp className="h-8 w-8 text-green-600" /><div><p className="text-sm text-muted-foreground">Total Proventos</p><p className="text-2xl font-bold text-green-600">{formatCurrency(totalProventos)}</p></div></CardContent></Card>
      <Card><CardContent className="pt-6 flex items-center gap-4"><TrendingDown className="h-8 w-8 text-red-600" /><div><p className="text-sm text-muted-foreground">Total Descontos</p><p className="text-2xl font-bold text-red-600">{formatCurrency(totalDescontos)}</p></div></CardContent></Card>
      <Card><CardContent className="pt-6 flex items-center gap-4"><DollarSign className="h-8 w-8 text-primary" /><div><p className="text-sm text-muted-foreground">Total Líquido</p><p className="text-2xl font-bold">{formatCurrency(totalLiquido)}</p></div></CardContent></Card>
    </div>
  );
}
