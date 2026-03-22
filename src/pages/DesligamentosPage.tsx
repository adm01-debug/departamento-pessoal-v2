import { useState, useMemo } from 'react';
import { useDesligamentos } from '@/hooks/useDesligamentos';
import { PageLayout } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { EmptyList } from '@/components/ui/empty-state';
import { UserMinus, Plus, Eye, MoreHorizontal, Download, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  DesligamentoKPIs,
  DesligamentoFilters,
  StatusBadge,
  TipoBadge,
  DesligamentoDetailSheet,
  NovoDesligamentoDialog,
} from '@/components/desligamentos';

export default function DesligamentosPage() {
  const { desligamentos, isLoading } = useDesligamentos();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [selectedDesligamento, setSelectedDesligamento] = useState<any | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showNovo, setShowNovo] = useState(false);

  const filtered = useMemo(() => {
    return desligamentos.filter((d: any) => {
      const matchSearch = !search || 
        (d.colaborador?.nome_completo || '').toLowerCase().includes(search.toLowerCase()) ||
        (d.motivo || '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'todos' || d.status === statusFilter;
      const matchTipo = tipoFilter === 'todos' || d.tipo === tipoFilter;
      return matchSearch && matchStatus && matchTipo;
    });
  }, [desligamentos, search, statusFilter, tipoFilter]);

  const openDetail = (d: any) => {
    setSelectedDesligamento(d);
    setShowDetail(true);
  };

  return (
    <PageLayout
      title="Desligamentos"
      description="Controle completo de desligamentos e rescisões"
      icon={<UserMinus className="h-5 w-5 text-primary-foreground" />}
      gradient="from-destructive to-destructive/70"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/calculadora-rescisao')}
            className="rounded-xl font-body"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Calculadora
          </Button>
          <Button
            onClick={() => setShowNovo(true)}
            className="rounded-xl bg-gradient-to-r from-destructive to-destructive/70 hover:opacity-90 shadow-lg font-body"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Desligamento
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* KPIs */}
        {!isLoading && desligamentos.length > 0 && (
          <DesligamentoKPIs desligamentos={desligamentos} />
        )}

        {/* Filters */}
        <DesligamentoFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          tipoFilter={tipoFilter}
          onTipoChange={setTipoFilter}
        />

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center p-8"><Spinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <EmptyList entityName="desligamento" onCreate={() => setShowNovo(true)} />
        ) : (
          <Card className="border-border/30 rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/30 bg-muted/30">
                      <th className="text-left text-[10px] font-display font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Colaborador</th>
                      <th className="text-left text-[10px] font-display font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Data</th>
                      <th className="text-left text-[10px] font-display font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Tipo</th>
                      <th className="text-left text-[10px] font-display font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Status</th>
                      <th className="text-left text-[10px] font-display font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Valor Líquido</th>
                      <th className="text-left text-[10px] font-display font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Motivo</th>
                      <th className="text-right text-[10px] font-display font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((d: any, i: number) => (
                      <motion.tr
                        key={d.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        onClick={() => openDetail(d)}
                        className="border-b border-border/20 hover:bg-muted/20 cursor-pointer transition-colors group"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                              <span className="text-xs font-display font-bold text-destructive">
                                {(d.colaborador?.nome_completo || 'C')[0]}
                              </span>
                            </div>
                            <span className="text-sm font-body font-medium">{d.colaborador?.nome_completo || '—'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-body text-muted-foreground">
                          {d.data_desligamento ? new Date(d.data_desligamento).toLocaleDateString('pt-BR') : '—'}
                        </td>
                        <td className="px-4 py-3"><TipoBadge tipo={d.tipo} /></td>
                        <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                        <td className="px-4 py-3 text-sm font-body font-medium">
                          {d.valor_liquido ? `R$ ${d.valor_liquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}
                        </td>
                        <td className="px-4 py-3 text-sm font-body text-muted-foreground truncate max-w-[200px]">
                          {d.motivo || '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openDetail(d); }}>
                                <Eye className="h-3.5 w-3.5 mr-2" />Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate('/calculadora-rescisao'); }}>
                                <Calculator className="h-3.5 w-3.5 mr-2" />Calcular Rescisão
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination info */}
              <div className="px-4 py-3 border-t border-border/20 text-xs font-body text-muted-foreground">
                Exibindo {filtered.length} de {desligamentos.length} desligamentos
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detail Sheet */}
      <DesligamentoDetailSheet
        desligamento={selectedDesligamento}
        open={showDetail}
        onClose={() => setShowDetail(false)}
      />

      {/* Novo Dialog */}
      <NovoDesligamentoDialog
        open={showNovo}
        onClose={() => setShowNovo(false)}
      />
    </PageLayout>
  );
}
