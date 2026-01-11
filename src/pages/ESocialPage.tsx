// V15-244: src/pages/ESocialPage.tsx
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { FileCheck, Send, AlertCircle, CheckCircle } from 'lucide-react';

const eventos = [
  { codigo: 'S-1000', nome: 'Informações do Empregador', status: 'enviado', data: '10/01/2025' },
  { codigo: 'S-1005', nome: 'Tabela de Estabelecimentos', status: 'enviado', data: '10/01/2025' },
  { codigo: 'S-1010', nome: 'Tabela de Rubricas', status: 'pendente', data: '-' },
  { codigo: 'S-1200', nome: 'Remuneração de Trabalhador', status: 'erro', data: '08/01/2025' },
  { codigo: 'S-2200', nome: 'Cadastramento Inicial', status: 'enviado', data: '05/01/2025' },
];

export default function ESocialPage() {
  const statusVariant = (s: string) => s === 'enviado' ? 'success' : s === 'erro' ? 'error' : 'warning';
  return (
    <PageLayout title="eSocial" description="Gestão de eventos eSocial">
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">15</div><p className="text-xs text-muted-foreground">Eventos Enviados</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-yellow-600">3</div><p className="text-xs text-muted-foreground">Pendentes</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-red-600">1</div><p className="text-xs text-muted-foreground">Com Erro</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">98%</div><p className="text-xs text-muted-foreground">Conformidade</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><FileCheck className="h-5 w-5" />Eventos Recentes</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {eventos.map((e) => (
              <div key={e.codigo} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4">
                  {e.status === 'enviado' ? <CheckCircle className="h-5 w-5 text-green-600" /> : e.status === 'erro' ? <AlertCircle className="h-5 w-5 text-red-600" /> : <Send className="h-5 w-5 text-yellow-600" />}
                  <div><p className="font-medium">{e.codigo} - {e.nome}</p><p className="text-sm text-muted-foreground">{e.data}</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={e.status} variant={statusVariant(e.status) as any} />
                  {e.status === 'pendente' && <Button size="sm">Enviar</Button>}
                  {e.status === 'erro' && <Button size="sm" variant="destructive">Reenviar</Button>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
