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
import { Briefcase, Plus, TrendingUp, Search, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

export default function CargosPage() {
  const [search, setSearch] = useState('');
  const { cargos, isLoading } = useCargos();

  const filtered = Array.isArray(cargos) ? cargos.filter((c: any) => !search || 
    c.nome.toLowerCase().includes(search.toLowerCase()) ||
    (c.cbo && c.cbo.includes(search))
  ) : [];


  const formatCurrency = (v: number | null) => (v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <>
      <PageTitle title="Gestão de Cargos" description="Definição de funções e faixas salariais" />
      <PageLayout
        title="Cargos Premium"
        description="Estratégia de cargos, CBO e remuneração"
        icon={<Briefcase className="h-5 w-5 text-primary-foreground" />}
        gradient="from-warning to-info"
        actions={
          <Button className="rounded-xl bg-gradient-to-r from-warning to-info hover:opacity-90 shadow-lg font-bold">
            <Plus className="h-4 w-4 mr-2" />Novo Cargo
          </Button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <Card className="border-border/30 rounded-2xl"><CardContent className="p-4">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Total Cargos</p>
            <h3 className="text-2xl font-display font-bold">{cargos?.length || 0}</h3>
          </CardContent></Card>
          <Card className="border-border/30 rounded-2xl"><CardContent className="p-4">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Média Salarial</p>
            <h3 className="text-2xl font-display font-bold">
              {formatCurrency((Array.isArray(cargos) ? cargos.reduce((acc: number, c: any) => acc + (Number(c.salario_base) || 0), 0) : 0) / (cargos?.length || 1))}
            </h3>
          </CardContent></Card>
        </div>

        <DataTableToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Buscar por nome ou CBO..." />

        {isLoading ? (
          <div className="flex justify-center p-12"><Spinner size="lg" /></div>
        ) : !filtered.length ? (
          <EmptyList entityName="cargo" />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border/30 overflow-hidden shadow-elevated bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-display font-semibold">Cargo</TableHead>
                  <TableHead className="font-display font-semibold">CBO</TableHead>
                  <TableHead className="font-display font-semibold">Nível</TableHead>
                  <TableHead className="font-display font-semibold text-right">Salário Base</TableHead>
                  <TableHead className="font-display font-semibold">Status</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((cargo: any) => (
                  <TableRow key={cargo.id} className="hover:bg-accent/20 transition-colors group">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-body font-bold text-sm text-foreground">{cargo.nome}</span>
                        {cargo.descricao && <span className="text-[10px] text-muted-foreground truncate max-w-[250px]">{cargo.descricao}</span>}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-[11px] font-medium">{cargo.cbo || 'Não inf.'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-bold border-border/50">Lvl {cargo.nivel_hierarquico || 1}</Badge>
                    </TableCell>
                    <TableCell className="font-body text-right text-sm font-bold text-success">
                      {cargo.salario_base ? formatCurrency(cargo.salario_base) : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge className={cargo.ativo !== false ? 'bg-success/10 text-success border-0 text-[10px]' : 'bg-muted text-muted-foreground border-0 text-[10px]'}>
                        {cargo.ativo !== false ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Info className="h-4 w-4" />
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
