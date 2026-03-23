import { PageTitle } from '@/components/PageTitle';
import { useState } from 'react';
import { useCargos } from '@/hooks/useCargos';
import { PageLayout } from '@/components/layout';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyList } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CargosPage() {
  const [search, setSearch] = useState('');
  const { cargos, isLoading } = useCargos();

  const filtered = cargos.filter((c: any) => !search || c.nome.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
    <PageTitle title="Cargos" description="Gestão de cargos e funções" />
    <PageLayout
      title="Cargos"
      description="Gestão de cargos e funções"
      icon={<Briefcase className="h-5 w-5 text-primary-foreground" />}
      gradient="from-warning to-info"
      actions={
        <Button className="rounded-xl bg-gradient-to-r from-warning to-info hover:opacity-90 shadow-lg font-body">
          <Plus className="h-4 w-4 mr-2" />Novo Cargo
        </Button>
      }
    >
      <DataTableToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Buscar cargo..." />

      {isLoading ? (
        <div className="flex justify-center p-8"><Spinner size="lg" /></div>
      ) : !filtered.length ? (
        <EmptyList entityName="cargo" />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border/30 overflow-hidden shadow-elevated">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-display font-semibold">Nome</TableHead>
                <TableHead className="font-display font-semibold">CBO</TableHead>
                <TableHead className="font-display font-semibold">Salário Base</TableHead>
                <TableHead className="font-display font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((cargo: any) => (
                <TableRow key={cargo.id} className="hover:bg-accent/30 transition-colors">
                  <TableCell className="font-body font-medium">{cargo.nome}</TableCell>
                  <TableCell className="font-body">{cargo.cbo || '-'}</TableCell>
                  <TableCell className="font-body text-success font-semibold">{cargo.salario_base ? Number(cargo.salario_base).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}</TableCell>
                  <TableCell>
                    <Badge className={cargo.ativo !== false ? 'bg-success/15 text-success border-0' : 'bg-muted text-muted-foreground border-0'}>
                      {cargo.ativo !== false ? 'Ativo' : 'Inativo'}
                    </Badge>
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
