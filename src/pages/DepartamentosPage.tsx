import { useDepartamentos } from '@/hooks/useDepartamentos';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2 } from 'lucide-react';

export default function DepartamentosPage() {
  const { departamentos, isLoading } = useDepartamentos();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Departamentos</h1>
        <p className="text-muted-foreground">Gestão de departamentos da empresa</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-64" />
      ) : departamentos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum departamento cadastrado</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departamentos.map((dept: any) => (
                <TableRow key={dept.id}>
                  <TableCell className="font-medium">{dept.nome}</TableCell>
                  <TableCell>{dept.ativo !== false ? '✅ Ativo' : '❌ Inativo'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
