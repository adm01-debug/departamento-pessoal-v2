import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RefreshCw, Link2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { medidasDisciplinaresService } from '@/services/medidasDisciplinaresService';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Props {
  medidaId: string;
  tipo: string;
  statusWorkflow: string;
}

const rotulos: Record<string, string> = {
  afastamento: 'Afastamento (Ponto)',
  desligamento: 'Desligamento (RH)',
  lancamento_folha_pendente: 'Desconto em Folha (pendente)',
  lancamento_folha_aplicado: 'Desconto em Folha (aplicado)',
};

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  aplicado: 'default',
  pendente: 'secondary',
  erro: 'destructive',
  cancelado: 'outline',
};

export function MedidaIntegracaoCard({ medidaId, tipo, statusWorkflow }: Props) {
  const qc = useQueryClient();
  const aplicavel = ['suspensao', 'justa_causa', 'demissao_justa_causa'].includes(tipo);

  const { data, isLoading } = useQuery({
    queryKey: ['medida-integracao', medidaId],
    queryFn: () => medidasDisciplinaresService.listarIntegracao(medidaId),
    enabled: aplicavel,
  });

  const aplicar = useMutation({
    mutationFn: () => medidasDisciplinaresService.aplicarIntegracao(medidaId),
    onSuccess: (res) => {
      toast.success('Integração aplicada com Folha/Ponto');
      qc.invalidateQueries({ queryKey: ['medida-integracao', medidaId] });
      // eslint-disable-next-line no-console
      console.info('[medida-integracao]', res);
    },
    onError: (e: any) => toast.error(e?.message ?? 'Falha ao integrar'),
  });

  if (!aplicavel) return null;

  const erro = data?.find((d: any) => d.status === 'erro');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Link2 className="h-4 w-4 text-primary" />
          Integração Folha & Ponto
        </CardTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={() => aplicar.mutate()}
          disabled={statusWorkflow !== 'aplicada' || aplicar.isPending}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${aplicar.isPending ? 'animate-spin' : ''}`} />
          Reprocessar
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {statusWorkflow !== 'aplicada' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Aguardando aplicação</AlertTitle>
            <AlertDescription>
              A integração é disparada automaticamente quando a medida é aplicada no workflow.
            </AlertDescription>
          </Alert>
        )}

        {erro && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro na integração</AlertTitle>
            <AlertDescription className="text-xs">
              {erro.detalhes?.erro ?? 'Erro desconhecido'} — clique em Reprocessar.
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : (data?.length ?? 0) === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum registro de integração ainda.</p>
        ) : (
          <div className="space-y-2">
            {data!.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-md border p-3 text-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {item.status === 'aplicado' && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    )}
                    <span className="font-medium truncate">
                      {rotulos[item.tipo_integracao] ?? item.tipo_integracao}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex flex-wrap gap-x-3">
                    {item.competencia && <span>Comp.: {item.competencia}</span>}
                    {item.dias != null && <span>{item.dias} dia(s)</span>}
                    {item.valor != null && (
                      <span>
                        R${' '}
                        {Number(item.valor).toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    )}
                    <span>{format(new Date(item.created_at), 'dd/MM/yyyy HH:mm')}</span>
                  </div>
                </div>
                <Badge variant={statusVariant[item.status] ?? 'secondary'}>{item.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
