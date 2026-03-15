import { useAdmissoes } from '@/hooks/useAdmissoes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { UserPlus } from 'lucide-react';

const etapaLabels: Record<string, string> = {
  documentos_pendentes: 'Docs Pendentes',
  aguardando_exame: 'Aguardando Exame',
  aguardando_aprovacao: 'Aguardando Aprovação',
  aprovada: 'Aprovada',
  contrato_gerado: 'Contrato Gerado',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
};

const etapaColors: Record<string, string> = {
  documentos_pendentes: 'bg-yellow-100 text-yellow-800',
  aguardando_exame: 'bg-orange-100 text-orange-800',
  aguardando_aprovacao: 'bg-blue-100 text-blue-800',
  aprovada: 'bg-green-100 text-green-800',
  concluida: 'bg-emerald-100 text-emerald-800',
  cancelada: 'bg-red-100 text-red-800',
};

export default function AdmissoesPage() {
  const { admissoes, isLoading } = useAdmissoes();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admissões</h1>
          <p className="text-muted-foreground">Gerencie o processo de admissão de colaboradores</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-40" />)}
        </div>
      ) : admissoes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma admissão em andamento</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {admissoes.map((admissao: any) => (
            <Card key={admissao.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{admissao.nome}</CardTitle>
                  <Badge className={etapaColors[admissao.etapa] || 'bg-muted text-muted-foreground'}>
                    {etapaLabels[admissao.etapa] || admissao.etapa}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p><strong>Cargo:</strong> {admissao.cargo}</p>
                <p><strong>Departamento:</strong> {admissao.departamento}</p>
                <p><strong>Data prevista:</strong> {new Date(admissao.data_prevista).toLocaleDateString('pt-BR')}</p>
                <p><strong>Salário:</strong> {Number(admissao.salario_proposto).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
