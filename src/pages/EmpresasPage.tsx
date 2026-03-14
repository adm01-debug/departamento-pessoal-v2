import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyList } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { empresaService } from '@/services';
import { Building2, Edit, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function EmpresasPage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const { data: empresas, isLoading } = useQuery({
    queryKey: ['empresas', search],
    queryFn: () => empresaService.list(),
  });

  const filtered = empresas?.filter(e =>
    !search || e.razao_social.toLowerCase().includes(search.toLowerCase()) || (e.cnpj && e.cnpj.includes(search))
  );

  return (
    <PageLayout
      title="Empresas"
      description="Gestão de empresas"
      icon={<Building2 className="h-5 w-5 text-white" />}
      gradient="from-xp to-tasks"
      actions={
        <Button
          onClick={() => navigate('/empresas/nova')}
          className="rounded-xl bg-gradient-to-r from-xp to-tasks hover:opacity-90 shadow-lg font-body"
        >
          Nova Empresa
        </Button>
      }
    >
      <DataTableToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Buscar empresa..." />

      {isLoading ? (
        <div className="flex justify-center p-8"><Spinner size="lg" /></div>
      ) : !filtered?.length ? (
        <EmptyList entityName="empresa" onCreate={() => navigate('/empresas/nova')} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((empresa, i) => (
            <motion.div
              key={empresa.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="group border border-border/30 hover:border-border/60 shadow-elevated hover:shadow-glow transition-all duration-300 rounded-2xl overflow-hidden">
                <div className="h-[2px] bg-gradient-to-r from-xp to-tasks opacity-60 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-xp to-tasks shadow-lg group-hover:scale-110 transition-transform">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-display truncate">{empresa.nome_fantasia || empresa.razao_social}</CardTitle>
                    <p className="text-sm text-muted-foreground font-body">{empresa.cnpj}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-body">
                      <Users className="h-4 w-4" />
                      <span>0 colaboradores</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/empresas/${empresa.id}/editar`)} className="rounded-xl hover:bg-xp/10 font-body">
                      <Edit className="h-4 w-4 mr-1" />Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
