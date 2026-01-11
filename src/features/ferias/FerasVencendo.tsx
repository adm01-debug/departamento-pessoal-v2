// V15-509
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
const vencendo = [{ nome: 'João Silva', diasRestantes: 15, vencimento: '15/02/2025' }, { nome: 'Maria Santos', diasRestantes: 7, vencimento: '08/02/2025' }, { nome: 'Pedro Lima', diasRestantes: 25, vencimento: '25/02/2025' }];
export function FeriasVencendo() {
  return (
    <Card><CardHeader className="flex flex-row items-center gap-2"><AlertTriangle className="h-5 w-5 text-yellow-600" /><CardTitle>Férias Vencendo</CardTitle></CardHeader><CardContent className="space-y-4">
      {vencendo.map((f, i) => (<div key={i} className="flex items-center justify-between"><div className="flex items-center gap-3"><Avatar className="h-8 w-8"><AvatarFallback>{f.nome.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar><div><p className="font-medium text-sm">{f.nome}</p><p className="text-xs text-muted-foreground">Vence em {f.vencimento}</p></div></div><Badge variant={f.diasRestantes <= 7 ? 'destructive' : f.diasRestantes <= 15 ? 'secondary' : 'outline'}>{f.diasRestantes} dias</Badge></div>))}
    </CardContent></Card>
  );
}
