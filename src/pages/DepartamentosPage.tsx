import { useState } from 'react';
import { useDepartamentos } from '@/hooks/useDepartamentos';
import { PageLayout } from '@/components/layout';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyList } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DepartamentosPage() {
  const [search, setSearch] = useState('');
  const { departamentos, isLoading } = useDepartamentos();

  const filtered = departamentos.filter((d: any) => !search || d.nome.toLowerCase().includes(search.toLowerCase()));

  return (
    <PageLayout
      title="Departamentos"
      description="Gestão de departamentos da empresa"
      icon={<Building2 className="h-5 w-5 text-primary-foreground" />}
      gradient="from-info to-primary"
      actions={
        <Button className="rounded-xl bg-gradient-to-r from-info to-primary hover:opacity-90 shadow-lg font-body">
          <Plus className="h-4 w-4 mr-2" />Novo Departamento
        </Button>
      }
    >
      <DataTableToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Buscar departamento..." />

      {isLoading ? (
        <div className="flex justify-center p-8"><Spinner size="lg" /></div>
      ) : !filtered.length ? (
        <EmptyList entityName="departamento" />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border/30 overflow-hidden shadow-elevated">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-display font-semibold">Nome</TableHead>
                <TableHead className="font-display font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((dept: any) => (
                <TableRow key={dept.id} className="hover:bg-accent/30 transition-colors">
                  <TableCell className="font-body font-medium">{dept.nome}</TableCell>
                  <TableCell>
                    <Badge className={dept.ativo !== false ? 'bg-success/15 text-success border-0' : 'bg-muted text-muted-foreground border-0'}>
                      {dept.ativo !== false ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      )}
    </PageLayout>
  );
}
