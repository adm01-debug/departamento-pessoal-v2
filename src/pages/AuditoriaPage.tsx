import { useQuery } from '@tanstack/react-query';
import { auditoriaService } from '@/services/auditoriaService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield } from 'lucide-react';

export default function AuditoriaPage() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['auditoria'],
    queryFn: () => auditoriaService.listar({ limite: 100 }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Auditoria</h1>
        <p className="text-muted-foreground">Log de auditoria do sistema</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-64" />
      ) : !logs || logs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum registro de auditoria</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Últimas ações</CardTitle>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Tabela</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Usuário</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log: any) => (
                <TableRow key={log.id}>
                  <TableCell>{new Date(log.created_at).toLocaleString('pt-BR')}</TableCell>
                  <TableCell>{log.tabela}</TableCell>
                  <TableCell>{log.acao}</TableCell>
                  <TableCell>{log.user_email || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
