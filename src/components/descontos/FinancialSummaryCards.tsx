import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Landmark, Wallet, AlertCircle } from 'lucide-react';

export function FinancialSummaryCards({ emprestimos, adiantamentos, fmt }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
        <CardHeader className="pb-2">
          <CardDescription>Empréstimos Ativos</CardDescription>
          <CardTitle className="text-2xl">{emprestimos.filter((e:any) => e.status === 'ativo').length}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Landmark className="h-3 w-3" />
            Total Retido: {fmt(emprestimos.reduce((acc:number, e:any) => acc + (e.status === 'ativo' ? e.valor_parcela : 0), 0))} / mês
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-warning/10 to-transparent border-warning/20">
        <CardHeader className="pb-2">
          <CardDescription>Adiantamentos Pendentes</CardDescription>
          <CardTitle className="text-2xl">{adiantamentos.filter((a:any) => a.status === 'pendente').length}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Wallet className="h-3 w-3" />
            Valor a Liberar: {fmt(adiantamentos.filter((a:any) => a.status === 'pendente').reduce((acc:number, a:any) => acc + Number(a.valor_solicitado), 0))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-info/10 to-transparent border-info/20">
        <CardHeader className="pb-2">
          <CardDescription>Alertas de Margem</CardDescription>
          <CardTitle className="text-2xl">0</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <AlertCircle className="h-3 w-3" />
            Colaboradores acima de 30% de desconto
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
