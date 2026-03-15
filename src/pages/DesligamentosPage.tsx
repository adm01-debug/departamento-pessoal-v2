import { useDesligamentos } from '@/hooks/useDesligamentos';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { UserMinus } from 'lucide-react';

export default function DesligamentosPage() {
  const { desligamentos, isLoading } = useDesligamentos();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Desligamentos</h1>
        <p className="text-muted-foreground">Controle de desligamentos e rescisões</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-40" />)}
        </div>
      ) : desligamentos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserMinus className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum desligamento registrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {desligamentos.map((d: any) => (
            <Card key={d.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{d.colaborador?.nome_completo || 'Colaborador'}</CardTitle>
                  <Badge variant="destructive">{d.tipo_rescisao || 'Desligamento'}</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p><strong>Data:</strong> {d.data_desligamento ? new Date(d.data_desligamento).toLocaleDateString('pt-BR') : '-'}</p>
                <p><strong>Status:</strong> {d.status || '-'}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
