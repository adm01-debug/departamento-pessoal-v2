import { PageTitle } from '@/components/PageTitle';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyList } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { auditoriaService } from '@/services/auditoriaService';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const acaoColors: Record<string, string> = {
  INSERT: 'bg-success/15 text-success border-0',
  UPDATE: 'bg-info/15 text-info border-0',
  DELETE: 'bg-destructive/15 text-destructive border-0',
};

export default function AuditoriaPage() {
  const [search, setSearch] = useState('');
  const { data: logs, isLoading } = useQuery({
    queryKey: ['auditoria'],
    queryFn: () => auditoriaService.listar({ limite: 200 }),
  });

  const filtered = logs?.filter((l: any) =>
    !search || (l.tabela || '').toLowerCase().includes(search.toLowerCase()) || (l.user_email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
    <PageTitle title="Auditoria" description="Logs e trilha de auditoria do sistema" />
    <PageLayout
      title="Auditoria"
      description="Log de auditoria do sistema"
      icon={<Shield className="h-5 w-5 text-primary-foreground" />}
      gradient="from-primary to-info"
    >
      <DataTableToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Buscar por tabela ou usuário..." />

      {isLoading ? (
        <div className="flex justify-center p-8"><Spinner size="lg" /></div>
      ) : !filtered?.length ? (
        <EmptyList entityName="registro de auditoria" />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border/30 overflow-hidden shadow-elevated">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-display font-semibold">Data</TableHead>
                <TableHead className="font-display font-semibold">Tabela</TableHead>
                <TableHead className="font-display font-semibold">Ação</TableHead>
                <TableHead className="font-display font-semibold">Usuário</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((log: any) => (
                <TableRow key={log.id} className="hover:bg-accent/30 transition-colors">
                  <TableCell className="font-body">{new Date(log.created_at).toLocaleString('pt-BR')}</TableCell>
                  <TableCell className="font-body font-medium">{log.tabela}</TableCell>
                  <TableCell><Badge className={acaoColors[log.acao] || 'bg-muted text-muted-foreground border-0'}>{log.acao}</Badge></TableCell>
                  <TableCell className="font-body">{log.user_email || '-'}</TableCell>
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
