import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, ShieldCheck, Loader2, FileCheck2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Resultado {
  valid: boolean;
  error?: string;
  hash?: string;
  acao?: string;
  registrado_em?: string;
  ip_mascarado?: string | null;
  motivo_recusa?: string | null;
  medida?: {
    tipo: string;
    numero: number;
    artigo_clt: string | null;
    gravidade: string | null;
    dias_suspensao: number | null;
    data_ocorrencia: string;
  };
  empresa?: { razao_social: string; cnpj: string };
}

const tipoLabel: Record<string, string> = {
  advertencia_verbal: 'Advertência Verbal',
  advertencia_escrita: 'Advertência Escrita',
  suspensao: 'Suspensão Disciplinar',
  justa_causa: 'Rescisão por Justa Causa',
};

export default function VerificarCienciaPage() {
  const { hash } = useParams<{ hash: string }>();
  const [loading, setLoading] = useState(true);
  const [res, setRes] = useState<Resultado | null>(null);

  useEffect(() => {
    if (!hash) return;
    (async () => {
      const { data, error } = await supabase.rpc('medida_verificar_ciencia_hash', { p_hash: hash });
      if (error) setRes({ valid: false, error: error.message });
      else setRes(data as unknown as Resultado);
      setLoading(false);
    })();
  }, [hash]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!res?.valid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-destructive/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" /> Comprovante inválido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {res?.error ?? 'Nenhum registro corresponde a este hash.'}
            </p>
            <p className="mt-2 break-all font-mono text-xs text-muted-foreground">{hash}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isCiencia = res.acao === 'ciencia';

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <FileCheck2 className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Verificação de Comprovante</h1>
        </div>

        <Alert className={isCiencia ? '' : 'border-destructive/40'}>
          <ShieldCheck className="h-4 w-4" />
          <AlertTitle className="flex items-center gap-2">
            {isCiencia ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-primary" /> Comprovante autêntico — Ciência
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-destructive" /> Comprovante autêntico — Recusa
              </>
            )}
          </AlertTitle>
          <AlertDescription>
            Este comprovante foi gerado eletronicamente pelo sistema em conformidade com a Lei
            14.063/2020 (assinatura eletrônica) e CLT Art. 482. O hash SHA-256 abaixo garante a
            integridade e imutabilidade do registro.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dados do registro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Empresa</p>
                <p className="font-medium">{res.empresa?.razao_social}</p>
                <p className="text-xs text-muted-foreground">CNPJ {res.empresa?.cnpj}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Medida disciplinar</p>
                <p className="font-medium">#{res.medida?.numero} · {tipoLabel[res.medida?.tipo ?? ''] ?? res.medida?.tipo}</p>
                <p className="text-xs text-muted-foreground">
                  Ocorrência: {res.medida?.data_ocorrencia && format(new Date(res.medida.data_ocorrencia + 'T00:00:00'), 'dd/MM/yyyy')}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {res.medida?.artigo_clt && <Badge variant="outline">CLT {res.medida.artigo_clt}</Badge>}
              {res.medida?.gravidade && <Badge variant="secondary">{res.medida.gravidade}</Badge>}
              {res.medida?.dias_suspensao && <Badge variant="secondary">{res.medida.dias_suspensao} dias</Badge>}
              <Badge variant={isCiencia ? 'default' : 'destructive'}>
                {isCiencia ? 'Colaborador deu ciência' : 'Colaborador recusou assinatura'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t pt-3">
              <div>
                <p className="text-xs text-muted-foreground">Registrado em</p>
                <p className="font-medium">
                  {res.registrado_em && format(new Date(res.registrado_em), "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Origem (IP mascarado)</p>
                <p className="font-mono text-xs">{res.ip_mascarado ?? '—'}</p>
              </div>
            </div>

            {res.motivo_recusa && (
              <div className="border-t pt-3">
                <p className="text-xs text-muted-foreground">Motivo da recusa</p>
                <p className="whitespace-pre-line rounded-md border bg-destructive/5 p-2 text-sm">
                  {res.motivo_recusa}
                </p>
              </div>
            )}

            <div className="border-t pt-3">
              <p className="text-xs text-muted-foreground">Assinatura criptográfica (SHA-256)</p>
              <p className="break-all rounded-md border bg-muted/40 p-2 font-mono text-xs">{res.hash}</p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Documento verificado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
        </p>
      </div>
    </div>
  );
}
