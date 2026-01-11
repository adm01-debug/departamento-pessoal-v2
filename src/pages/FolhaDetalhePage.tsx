// V15-246: src/pages/FolhaDetalhePage.tsx
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FolhaStatus } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { folhaService } from '@/services';
import { Download, Lock, Printer } from 'lucide-react';

export default function FolhaDetalhePage() {
  const { id } = useParams();
  const { data: folha, isLoading } = useQuery({ queryKey: ['folha', id], queryFn: () => folhaService.getById(id!), enabled: !!id });
  const { data: itens } = useQuery({ queryKey: ['folha-itens', id], queryFn: () => folhaService.getItens(id!), enabled: !!id });

  const fmt = (v: number) => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00';

  if (isLoading) return <div className="flex justify-center p-8"><Spinner size="lg" /></div>;
  if (!folha) return <div>Folha não encontrada</div>;

  return (
    <PageLayout title={`Folha ${folha.competencia}`} description={folha.tipo} actions={
      <div className="flex gap-2">
        <Button variant="outline"><Printer className="h-4 w-4 mr-2" />Imprimir</Button>
        <Button variant="outline"><Download className="h-4 w-4 mr-2" />Exportar</Button>
        {folha.status !== 'fechada' && <Button><Lock className="h-4 w-4 mr-2" />Fechar Folha</Button>}
      </div>
    }>
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{fmt(folha.total_proventos)}</div><p className="text-xs text-muted-foreground">Total Proventos</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-red-600">{fmt(folha.total_descontos)}</div><p className="text-xs text-muted-foreground">Total Descontos</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{fmt(folha.total_liquido)}</div><p className="text-xs text-muted-foreground">Total Líquido</p></CardContent></Card>
        <Card><CardContent className="pt-6"><FolhaStatus status={folha.status} /><p className="text-xs text-muted-foreground mt-1">Status</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Colaboradores</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Salário Base</TableHead><TableHead>Proventos</TableHead><TableHead>Descontos</TableHead><TableHead>Líquido</TableHead></TableRow></TableHeader>
            <TableBody>
              {itens?.map((i: any) => (
                <TableRow key={i.id}><TableCell>{i.colaborador_nome}</TableCell><TableCell>{fmt(i.salario_base)}</TableCell><TableCell className="text-green-600">{fmt(i.total_proventos)}</TableCell><TableCell className="text-red-600">{fmt(i.total_descontos)}</TableCell><TableCell className="font-bold">{fmt(i.valor_liquido)}</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
