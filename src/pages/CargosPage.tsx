import { useCargos } from '@/hooks/useCargos';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase } from 'lucide-react';

export default function CargosPage() {
  const { cargos, isLoading } = useCargos();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cargos</h1>
        <p className="text-muted-foreground">Gestão de cargos e funções</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-64" />
      ) : cargos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum cargo cadastrado</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CBO</TableHead>
                <TableHead>Salário Base</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cargos.map((cargo: any) => (
                <TableRow key={cargo.id}>
                  <TableCell className="font-medium">{cargo.nome}</TableCell>
                  <TableCell>{cargo.cbo || '-'}</TableCell>
                  <TableCell>{cargo.salario_base ? Number(cargo.salario_base).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}</TableCell>
                  <TableCell>{cargo.ativo ? '✅ Ativo' : '❌ Inativo'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
