import { useAfastamentos } from '@/hooks/useAfastamentos';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { HeartPulse } from 'lucide-react';

export default function AfastamentosPage() {
  const { afastamentos, isLoading } = useAfastamentos();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Afastamentos</h1>
        <p className="text-muted-foreground">Controle de afastamentos dos colaboradores</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-40" />)}
        </div>
      ) : afastamentos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <HeartPulse className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum afastamento registrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {afastamentos.map((a: any) => (
            <Card key={a.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{a.colaborador?.nome_completo || 'Colaborador'}</CardTitle>
                  <Badge variant={a.status === 'ativo' ? 'default' : 'secondary'}>{a.status || a.tipo}</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p><strong>Tipo:</strong> {a.tipo}</p>
                <p><strong>Início:</strong> {new Date(a.data_inicio).toLocaleDateString('pt-BR')}</p>
                <p><strong>Previsão fim:</strong> {new Date(a.data_fim_prevista).toLocaleDateString('pt-BR')}</p>
                {a.cid && <p><strong>CID:</strong> {a.cid}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
