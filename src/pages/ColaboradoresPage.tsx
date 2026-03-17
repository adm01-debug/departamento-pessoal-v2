import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ColaboradorStatus } from '@/components/ui/status-badge';
import { EmptyList } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { colaboradorService } from '@/services';
import { Eye, Edit, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmpresa } from '@/contexts';
import { motion } from 'framer-motion';

export default function ColaboradoresPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();
  const { empresaAtual } = useEmpresa();

  const { data: colaboradores, isLoading } = useQuery({
    queryKey: ['colaboradores', empresaAtual?.id],
    queryFn: () => colaboradorService.list(empresaAtual?.id),
    enabled: !!empresaAtual?.id,
  });

  const statusOptions = [
    { value: 'ativo', label: 'Ativo' },
    { value: 'inativo', label: 'Inativo' },
    { value: 'ferias', label: 'Férias' },
    { value: 'afastado', label: 'Afastado' },
  ];

  const filtered = colaboradores?.filter((c) => {
    const matchSearch = !search || c.nome_completo.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <PageLayout
      title="Colaboradores"
      description="Gestão de colaboradores"
      icon={<Users className="h-5 w-5 text-white" />}
      gradient="from-primary to-primary-glow"
      actions={
        <Button
          onClick={() => navigate('/colaboradores/novo')}
          className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow font-body"
        >
          Novo Colaborador
        </Button>
      }
    >
      <DataTableToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar colaborador..."
        filters={[{ key: 'status', label: 'Status', options: statusOptions, value: statusFilter, onChange: setStatusFilter }]}
      />

      {isLoading ? (
        <div className="flex justify-center p-8"><Spinner size="lg" /></div>
      ) : !filtered?.length ? (
        <EmptyList entityName="colaborador" onCreate={() => navigate('/colaboradores/novo')} />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border/30 overflow-hidden shadow-elevated">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-display font-semibold">Nome</TableHead>
                <TableHead className="font-display font-semibold">CPF</TableHead>
                <TableHead className="font-display font-semibold">Cargo</TableHead>
                <TableHead className="font-display font-semibold">Status</TableHead>
                <TableHead className="w-[100px] font-display font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} className="hover:bg-accent/30 transition-colors">
                  <TableCell className="font-body font-medium">{c.nome_completo}</TableCell>
                  <TableCell className="font-body">{c.cpf}</TableCell>
                  <TableCell className="font-body">{c.cargo}</TableCell>
                  <TableCell><ColaboradorStatus status={c.status} /></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-info/10" onClick={() => navigate(`/colaboradores/${c.id}/editar`)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-warning/10" onClick={() => navigate(`/colaboradores/${c.id}/editar`)}><Edit className="h-4 w-4" /></Button>
                    </div>
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
