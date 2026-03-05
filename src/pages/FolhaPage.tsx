// @ts-nocheck
// V15-225: src/pages/FolhaPage.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FolhaStatus } from '@/components/ui/status-badge';
import { EmptyList } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { folhaService } from '@/services';
import { Eye, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FolhaPage() {
  const [competencia, setCompetencia] = useState('');
  const navigate = useNavigate();

  const { data: folhas, isLoading } = useQuery({
    queryKey: ['folhas', competencia],
    queryFn: () => folhaService.list({ competencia: competencia || undefined }),
  });

  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <PageLayout title="Folha de Pagamento" description="Gestão de folhas de pagamento" actions={<Button onClick={() => navigate('/folha/calcular')}><Calculator className="h-4 w-4 mr-2" />Calcular Folha</Button>}>
      <DataTableToolbar
        search={competencia}
        onSearchChange={setCompetencia}
        searchPlaceholder="Competência (AAAA-MM)"
      />

      {isLoading ? (
        <div className="flex justify-center p-8"><Spinner size="lg" /></div>
      ) : !folhas?.length ? (
        <EmptyList entityName="folha" onCreate={() => navigate('/folha/calcular')} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Competência</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Total Proventos</TableHead>
              <TableHead>Total Descontos</TableHead>
              <TableHead>Total Líquido</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {folhas.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-medium">{f.competencia}</TableCell>
                <TableCell className="capitalize">{f.tipo.replace('_', ' ')}</TableCell>
                <TableCell className="text-green-600">{formatCurrency(f.total_proventos)}</TableCell>
                <TableCell className="text-red-600">{formatCurrency(f.total_descontos)}</TableCell>
                <TableCell className="font-bold">{formatCurrency(f.total_liquido)}</TableCell>
                <TableCell><FolhaStatus status={f.status} /></TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => navigate(`/folha/${f.id}`)}><Eye className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </PageLayout>
  );
}
