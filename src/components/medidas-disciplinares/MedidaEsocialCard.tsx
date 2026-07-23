import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileCheck2, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { medidasDisciplinaresService } from '@/services/medidasDisciplinaresService';
import { useEmpresas } from '@/hooks/useEmpresas';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Props {
  medidaId: string;
  tipo: string;
  statusWorkflow: string;
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  transmitido: 'default',
  processado: 'default',
  enviado: 'secondary',
  rascunho: 'outline',
  erro: 'destructive',
  rejeitado: 'destructive',
};

const rotuloEvento: Record<string, string> = {
  'S-2299': 'S-2299 · Desligamento (Justa Causa)',
  'S-2206': 'S-2206 · Alteração Contratual (Suspensão)',
};

export function MedidaEsocialCard({ medidaId, tipo, statusWorkflow }: Props) {
  const qc = useQueryClient();
  const { empresaAtual } = useEmpresas();
  const aplicavel = ['suspensao', 'justa_causa'].includes(tipo);
  const empresaId = empresaAtual?.id ?? '';

  const { data, isLoading } = useQuery({
    queryKey: ['medida-esocial', medidaId, empresaId],
    queryFn: () => medidasDisciplinaresService.listarEventosEsocial(medidaId, empresaId),
    enabled: aplicavel && !!empresaId,
  });

  const enfileirar = useMutation({
    mutationFn: () => medidasDisciplinaresService.enfileirarEsocial(medidaId),
    onSuccess: (res: any) => {
      if (res?.ok) {
        toast.success(
          res.reused ? 'Evento eSocial já estava enfileirado' : `Evento ${res.tipo} enfileirado`,
        );
      } else {
        toast.error(res?.erro ?? 'Falha ao enfileirar evento');
      }
      qc.invalidateQueries({ queryKey: ['medida-esocial', medidaId, empresaId] });
    },
    onError: (e: any) => toast.error(e?.message ?? 'Falha ao enfileirar evento eSocial'),
  });

  if (!aplicavel) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <FileCheck2 className="h-4 w-4 text-primary" />
          eSocial
        </CardTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={() => enfileirar.mutate()}
          disabled={statusWorkflow !== 'aplicada' || enfileirar.isPending}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${enfileirar.isPending ? 'animate-spin' : ''}`} />
          Enfileirar
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {statusWorkflow !== 'aplicada' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Aguardando aplicação</AlertTitle>
            <AlertDescription>
              O evento eSocial é gerado automaticamente quando a medida é aplicada.
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : (data?.length ?? 0) === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum evento eSocial gerado ainda para esta medida.
          </p>
        ) : (
          <div className="space-y-2">
            {data!.map((ev: any) => (
              <div
                key={ev.id}
                className="flex items-center justify-between gap-3 rounded-md border p-3 text-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {['transmitido', 'processado'].includes(ev.status) && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    )}
                    <span className="font-medium truncate">
                      {rotuloEvento[ev.tipo_evento] ?? ev.tipo_evento}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex flex-wrap gap-x-3">
                    {ev.competencia && <span>Comp.: {ev.competencia}</span>}
                    {ev.protocolo && <span>Prot.: {ev.protocolo}</span>}
                    {ev.recibo && <span>Recibo: {ev.recibo}</span>}
                    <span>{format(new Date(ev.created_at), 'dd/MM/yyyy HH:mm')}</span>
                  </div>
                </div>
                <Badge variant={statusVariant[ev.status] ?? 'secondary'}>{ev.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
