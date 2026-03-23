import { PageTitle } from '@/components/PageTitle';
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
import { Edit, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BeneficiosPage() {
  const [search, setSearch] = useState('');
  const { empresaAtual } = useEmpresa();
  const navigate = useNavigate();

  const { data: beneficios, isLoading } = useQuery({
    queryKey: ['beneficios', empresaAtual?.id],
    queryFn: () => beneficioService.list(empresaAtual?.id),
    enabled: !!empresaAtual?.id,
  });

  const filtered = beneficios?.filter(b => !search || b.nome.toLowerCase().includes(search.toLowerCase()));
  const formatCurrency = (v: number | null) => (v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <>
    <PageTitle title="Benefícios" description="Gestão de benefícios dos colaboradores" />
    <PageLayout
      title="Benefícios"
      description="Gestão de benefícios"
      icon={<Gift className="h-5 w-5 text-primary-foreground" />}
      gradient="from-xp to-store"
      actions={
        <Button onClick={() => navigate('/beneficios/novo')} className="rounded-xl bg-gradient-to-r from-xp to-store hover:opacity-90 shadow-lg font-body">
          Novo Benefício
        </Button>
      }
    >
      <DataTableToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Buscar benefício..." />

      {isLoading ? (
        <div className="flex justify-center p-8"><Spinner size="lg" /></div>
      ) : !filtered?.length ? (
        <EmptyList entityName="benefício" onCreate={() => navigate('/beneficios/novo')} />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border/30 overflow-hidden shadow-elevated">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-display font-semibold">Nome</TableHead>
                <TableHead className="font-display font-semibold">Tipo</TableHead>
                <TableHead className="font-display font-semibold">Valor</TableHead>
                <TableHead className="font-display font-semibold">Status</TableHead>
                <TableHead className="w-[80px] font-display font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => (
                <TableRow key={b.id} className="hover:bg-accent/30 transition-colors">
                  <TableCell className="font-body font-medium">{b.nome}</TableCell>
                  <TableCell className="font-body capitalize">{b.tipo || '-'}</TableCell>
                  <TableCell className="font-body text-success font-semibold">{formatCurrency(b.valor)}</TableCell>
                  <TableCell>
                    <Badge className={b.ativo ? 'bg-success/15 text-success border-0' : 'bg-muted text-muted-foreground border-0'}>
                      {b.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-xp/10"><Edit className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      )}
    </PageLayout>
    </>
  );
}
