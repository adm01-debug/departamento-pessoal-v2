import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Link2, Copy, CheckCircle2, ShieldCheck, Clock, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresas } from '@/hooks/useEmpresas';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  medidaId: string;
  statusWorkflow: string;
}

interface CienciaTokenRow {
  id: string;
  token: string;
  expires_at: string;
  used_at: string | null;
  acao: string | null;
  motivo_recusa: string | null;
  ip_address: string | null;
  assinatura_hash: string | null;
  created_at: string;
}

export function MedidaCienciaDigitalCard({ medidaId, statusWorkflow }: Props) {
  const qc = useQueryClient();
  const { empresaAtual } = useEmpresas();
  const [ultimoLink, setUltimoLink] = useState<string | null>(null);

  const podeGerar = ['aplicada', 'aprovada_rh', 'aprovada_juridico'].includes(statusWorkflow);

  const { data: tokens = [], isLoading } = useQuery({
    queryKey: ['medida-ciencia-tokens', medidaId, empresaAtual?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medidas_ciencia_tokens')
        .select('id, token, expires_at, used_at, acao, motivo_recusa, ip_address, assinatura_hash, created_at')
        .eq('medida_id', medidaId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as CienciaTokenRow[];
    },
    enabled: !!medidaId && !!empresaAtual?.id,
  });

  const gerarLink = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('medida_gerar_link_ciencia', { p_medida_id: medidaId });
      if (error) throw error;
      return data as { success: boolean; token: string; url_path: string };
    },
    onSuccess: (res) => {
      const url = `${window.location.origin}${res.url_path}`;
      setUltimoLink(url);
      navigator.clipboard.writeText(url).catch(() => undefined);
      toast.success('Link gerado e copiado para a área de transferência');
      qc.invalidateQueries({ queryKey: ['medida-ciencia-tokens', medidaId] });
    },
    onError: (err: Error) => toast.error(err.message || 'Erro ao gerar link'),
  });

  const copiar = (url: string) => {
    navigator.clipboard.writeText(url).then(() => toast.success('Link copiado'));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Ciência Digital do Colaborador
        </CardTitle>
        <Button
          size="sm"
          onClick={() => gerarLink.mutate()}
          disabled={!podeGerar || gerarLink.isPending}
        >
          <Link2 className="mr-2 h-4 w-4" />
          {gerarLink.isPending ? 'Gerando...' : 'Gerar link'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {!podeGerar && (
          <Alert>
            <AlertTitle>Ação indisponível</AlertTitle>
            <AlertDescription>
              A medida precisa estar aplicada ou aprovada pelo RH/Jurídico para gerar link de ciência.
            </AlertDescription>
          </Alert>
        )}

        {ultimoLink && (
          <div className="rounded-md border border-primary/40 bg-primary/5 p-3">
            <p className="mb-2 text-xs text-muted-foreground">
              Envie este link ao colaborador (válido por 7 dias):
            </p>
            <div className="flex gap-2">
              <Input readOnly value={ultimoLink} className="font-mono text-xs" />
              <Button size="icon" variant="outline" onClick={() => copiar(ultimoLink)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando histórico...</p>
        ) : tokens.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum link gerado ainda.</p>
        ) : (
          <div className="space-y-2">
            {tokens.map((t) => {
              const expirado = !t.used_at && new Date(t.expires_at) < new Date();
              const url = `${window.location.origin}/ciencia-medida/${t.token}`;
              return (
                <div
                  key={t.id}
                  className="flex items-start justify-between gap-3 rounded-md border p-3"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {t.used_at ? (
                        t.acao === 'ciencia' ? (
                          <Badge className="gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Ciência registrada
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1">
                            <XCircle className="h-3 w-3" /> Recusa registrada
                          </Badge>
                        )
                      ) : expirado ? (
                        <Badge variant="outline">Expirado</Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <Clock className="h-3 w-3" /> Pendente
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        Gerado {format(new Date(t.created_at), "dd/MM/yy HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                    {t.used_at && (
                      <p className="text-xs text-muted-foreground">
                        Registrado {format(new Date(t.used_at), "dd/MM/yy HH:mm", { locale: ptBR })}
                        {t.ip_address ? ` · IP ${t.ip_address}` : ''}
                      </p>
                    )}
                    {t.motivo_recusa && (
                      <p className="text-xs text-destructive">Motivo: {t.motivo_recusa}</p>
                    )}
                    {t.assinatura_hash && (
                      <p className="truncate font-mono text-[10px] text-muted-foreground">
                        SHA-256: {t.assinatura_hash}
                      </p>
                    )}
                  </div>
                  {!t.used_at && !expirado && (
                    <Button size="icon" variant="ghost" onClick={() => copiar(url)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
