// @ts-nocheck
// V15-228: src/pages/BeneficiosPage.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { EmptyList } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { beneficioService } from '@/services';
import { useEmpresa } from '@/contexts';
import { Edit, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BeneficiosPage() {
  const [search, setSearch] = useState('');
  const { empresaAtual } = useEmpresa();
  const navigate = useNavigate();

  const { data: beneficios, isLoading } = useQuery({
    queryKey: ['beneficios', empresaAtual?.id],
    queryFn: () => beneficioService.list(empresaAtual?.id || ''),
    enabled: !!empresaAtual?.id,
  });

  const filtered = beneficios?.filter(b => !search || b.nome.toLowerCase().includes(search.toLowerCase()));
  const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const tipoLabels: Record<string, string> = {
    vale_transporte: 'Vale Transporte', vale_refeicao: 'Vale Refeição', vale_alimentacao: 'Vale Alimentação',
    plano_saude: 'Plano de Saúde', plano_odontologico: 'Plano Odontológico', seguro_vida: 'Seguro de Vida',
  };

  return (
    <PageLayout title="Benefícios" description="Gestão de benefícios" actions={<Button onClick={() => navigate('/beneficios/novo')}>Novo Benefício</Button>}>
      <DataTableToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Buscar benefício..." />

      {isLoading ? (
        <div className="flex justify-center p-8"><Spinner size="lg" /></div>
      ) : !filtered?.length ? (
        <EmptyList entityName="benefício" onCreate={() => navigate('/beneficios/novo')} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor Empresa</TableHead>
              <TableHead>Valor Colaborador</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">{b.nome}</TableCell>
                <TableCell>{tipoLabels[b.tipo] || b.tipo}</TableCell>
                <TableCell>{formatCurrency(b.valor_empresa)}</TableCell>
                <TableCell>{formatCurrency(b.valor_colaborador)}</TableCell>
                <TableCell><Badge variant={b.ativo ? 'default' : 'secondary'}>{b.ativo ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><Users className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </PageLayout>
  );
}
