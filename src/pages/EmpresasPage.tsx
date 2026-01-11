// V15-224: src/pages/EmpresasPage.tsx
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

export default function EmpresasPage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const { data: empresas, isLoading } = useQuery({
    queryKey: ['empresas', search],
    queryFn: () => empresaService.list(),
  });

  const filtered = empresas?.filter(e => 
    !search || e.razao_social.toLowerCase().includes(search.toLowerCase()) || e.cnpj.includes(search)
  );

  return (
    <PageLayout title="Empresas" description="Gestão de empresas" actions={<Button onClick={() => navigate('/empresas/nova')}>Nova Empresa</Button>}>
      <DataTableToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Buscar empresa..." />

      {isLoading ? (
        <div className="flex justify-center p-8"><Spinner size="lg" /></div>
      ) : !filtered?.length ? (
        <EmptyList entityName="empresa" onCreate={() => navigate('/empresas/nova')} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((empresa) => (
            <Card key={empresa.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-2 bg-primary/10 rounded"><Building2 className="h-6 w-6 text-primary" /></div>
                <div className="flex-1">
                  <CardTitle className="text-base">{empresa.nome_fantasia || empresa.razao_social}</CardTitle>
                  <p className="text-sm text-muted-foreground">{empresa.cnpj}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>0 colaboradores</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/empresas/${empresa.id}`)}>
                    <Edit className="h-4 w-4 mr-1" />Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
