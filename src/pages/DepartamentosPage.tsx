import { PageTitle } from '@/components/PageTitle';
import { useState } from 'react';
import { useDepartamentos } from '@/hooks/useDepartamentos';
import { PageLayout } from '@/components/layout';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyList } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Plus, GitBranch, ArrowRight, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { NovoDepartamentoDialog } from '@/components/departamentos/NovoDepartamentoDialog';

export default function DepartamentosPage() {
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<any>(null);
  const { departamentos, isLoading } = useDepartamentos();
  const navigate = useNavigate();

  const abrirNovo = () => { setEditando(null); setDialogOpen(true); };
  const abrirEditar = (d: any) => { setEditando(d); setDialogOpen(true); };

  const filtered = (departamentos as any[]).filter((d: any) => !search || d.nome.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <PageTitle title="Unidades & Departamentos" description="Gestão da estrutura organizacional" />
      <PageLayout
        title="Departamentos 10/10"
        description="Gestão de unidades de negócio e centros de custo"
        icon={<Building2 className="h-5 w-5 text-primary-foreground" />}
        gradient="from-info to-primary"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl font-bold" onClick={() => navigate('/organograma')}>
              <GitBranch className="h-4 w-4 mr-2" />Ver Organograma
            </Button>
            <Button className="rounded-xl bg-gradient-to-r from-info to-primary hover:opacity-90 shadow-lg font-bold">
              <Plus className="h-4 w-4 mr-2" />Novo Departamento
            </Button>
          </div>
        }
      >
        <DataTableToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Buscar departamento..." />

        {isLoading ? (
          <div className="flex justify-center p-12"><Spinner size="lg" /></div>
        ) : !filtered.length ? (
          <EmptyList entityName="departamento" />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border/30 overflow-hidden shadow-elevated bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-display font-semibold">Departamento</TableHead>
                  <TableHead className="font-display font-semibold">C. Custo</TableHead>
                  <TableHead className="font-display font-semibold">Estrutura</TableHead>
                  <TableHead className="font-display font-semibold">Status</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((dept: any) => (
                  <TableRow key={dept.id} className="hover:bg-accent/20 transition-colors group">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-body font-bold text-sm text-foreground">{dept.nome}</span>
                        {dept.responsavel_id && <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">ID Responsável: {dept.responsavel_id.slice(0,8)}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-muted-foreground bg-muted/40 px-2 py-1 rounded-lg w-fit">
                        <Wallet className="h-3 w-3" />
                        {dept.codigo_centro_custo || 'GERAL'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {dept.departamento_pai_id ? (
                        <div className="flex items-center gap-1 text-[10px] text-info font-bold">
                          <GitBranch className="h-3 w-3" /> SUB-DEPTO
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[10px] text-success font-bold">
                          <Building2 className="h-3 w-3" /> UNIDADE RAIZ
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={dept.ativo !== false ? 'bg-success/10 text-success border-0 text-[10px]' : 'bg-muted text-muted-foreground border-0 text-[10px]'}>
                        {dept.ativo !== false ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        DETALHES <ArrowRight className="h-3 w-3" />
                      </Button>
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
