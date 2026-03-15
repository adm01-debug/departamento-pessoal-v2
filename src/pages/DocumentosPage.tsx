import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyList } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { documentoService } from '@/services';
import { FileText, Upload, Download, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DocumentosPage() {
  const [search, setSearch] = useState('');
  const { data: documentos, isLoading } = useQuery({
    queryKey: ['documentos'],
    queryFn: () => documentoService.listar(),
  });

  const filtered = documentos?.filter((d: any) =>
    !search || (d.nome || d.nome_arquivo || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageLayout
      title="Documentos"
      description="Gestão de documentos dos colaboradores"
      icon={<FileText className="h-5 w-5 text-primary-foreground" />}
      gradient="from-warning to-primary"
      actions={
        <Button className="rounded-xl bg-gradient-to-r from-warning to-primary hover:opacity-90 shadow-lg font-body">
          <Upload className="h-4 w-4 mr-2" />Upload
        </Button>
      }
    >
      <DataTableToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Buscar documento..." />

      {isLoading ? (
        <div className="flex justify-center p-8"><Spinner size="lg" /></div>
      ) : !filtered?.length ? (
        <EmptyList entityName="documento" />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border/30 overflow-hidden shadow-elevated">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-display font-semibold">Nome</TableHead>
                <TableHead className="font-display font-semibold">Tipo</TableHead>
                <TableHead className="font-display font-semibold">Data</TableHead>
                <TableHead className="w-[100px] font-display font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((doc: any) => (
                <TableRow key={doc.id} className="hover:bg-accent/30 transition-colors">
                  <TableCell className="font-body font-medium">{doc.nome || doc.nome_arquivo || '-'}</TableCell>
                  <TableCell><Badge className="bg-info/15 text-info border-0 font-body">{doc.tipo || '-'}</Badge></TableCell>
                  <TableCell className="font-body">{doc.created_at ? new Date(doc.created_at).toLocaleDateString('pt-BR') : '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-info/10"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-success/10"><Download className="h-4 w-4" /></Button>
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
