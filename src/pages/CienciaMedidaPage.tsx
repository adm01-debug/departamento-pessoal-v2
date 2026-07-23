import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, ShieldCheck, FileText, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TokenData {
  valid: boolean;
  error?: string;
  expires_at?: string;
  medida?: {
    id: string;
    tipo: string;
    descricao: string;
    data_ocorrencia: string;
    artigo_clt: string | null;
    dias_suspensao: number | null;
    gravidade: string | null;
    pdf_url: string | null;
  };
  colaborador?: { nome: string; cpf: string };
  empresa?: { razao_social: string; cnpj: string };
}

const tipoLabel: Record<string, string> = {
  advertencia_verbal: 'Advertência Verbal',
  advertencia_escrita: 'Advertência Escrita',
  suspensao: 'Suspensão Disciplinar',
  justa_causa: 'Rescisão por Justa Causa',
};

export default function CienciaMedidaPage() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TokenData | null>(null);
  const [aceite, setAceite] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<{ acao: string; hash: string; registrado_em: string } | null>(null);
  const [geo, setGeo] = useState<GeolocationCoordinates | null>(null);

  useEffect(() => {
    if (!token) return;
    (async () => {
      const { data: res, error } = await supabase.rpc('medida_consultar_por_token', { p_token: token });
      if (error) {
        setData({ valid: false, error: error.message });
      } else {
        setData(res as unknown as TokenData);
      }
      setLoading(false);
    })();
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (p) => setGeo(p.coords),
        () => undefined,
        { timeout: 4000, maximumAge: 60000 },
      );
    }
  }, [token]);

  const registrar = async (acao: 'ciencia' | 'recusa') => {
    if (!token) return;
    if (acao === 'recusa' && motivo.trim().length < 10) {
      alert('Informe um motivo com no mínimo 10 caracteres.');
      return;
    }
    setEnviando(true);
    try {
      const { data: res, error } = await supabase.rpc('medida_registrar_ciencia_publica', {
        p_token: token,
        p_acao: acao,
        p_motivo_recusa: acao === 'recusa' ? motivo.trim() : null,
        p_ip: null,
        p_user_agent: navigator.userAgent,
        p_geo: geo
          ? { lat: geo.latitude, lng: geo.longitude, accuracy: geo.accuracy }
          : null,
      });
      if (error) throw error;
      const parsed = res as { success: boolean; error?: string; acao?: string; hash?: string; registrado_em?: string };
      if (!parsed.success) throw new Error(parsed.error || 'Falha ao registrar');
      setResultado({ acao: parsed.acao!, hash: parsed.hash!, registrado_em: parsed.registrado_em! });
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setEnviando(false);
    }
  };

  const gravidadeVariant = useMemo<'default' | 'secondary' | 'destructive' | 'outline'>(() => {
    switch (data?.medida?.gravidade) {
      case 'grave':
      case 'gravissima':
        return 'destructive';
      case 'media':
        return 'secondary';
      default:
        return 'outline';
    }
  }, [data]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data?.valid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" /> Link inválido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {data?.error || 'Este link é inválido, expirou ou já foi utilizado. Solicite um novo link ao seu RH.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (resultado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {resultado.acao === 'ciencia' ? (
                <>
                  <CheckCircle2 className="h-6 w-6 text-primary" /> Ciência registrada
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-destructive" /> Recusa registrada
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              Registro efetuado em{' '}
              <strong>{format(new Date(resultado.registrado_em), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</strong>.
            </p>
            <div className="rounded-md border bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">Comprovante (SHA-256):</p>
              <p className="break-all font-mono text-xs">{resultado.hash}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Guarde este comprovante. Uma cópia foi enviada ao RH da empresa.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const med = data.medida!;
  const col = data.colaborador!;
  const emp = data.empresa!;

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <ShieldCheck className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Ciência de Medida Disciplinar</h1>
        </div>

        <Alert>
          <AlertTitle>Portal seguro</AlertTitle>
          <AlertDescription>
            Este é um documento oficial. Sua manifestação (ciência ou recusa) será registrada com data,
            hora, IP e assinatura criptográfica (SHA-256) conforme CLT Art. 482 e Lei 14.063/2020.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dados do documento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Empresa</p>
                <p className="font-medium">{emp.razao_social}</p>
                <p className="text-xs text-muted-foreground">CNPJ {emp.cnpj}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Colaborador</p>
                <p className="font-medium">{col.nome}</p>
                <p className="text-xs text-muted-foreground">CPF {col.cpf}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge>{tipoLabel[med.tipo] ?? med.tipo}</Badge>
              {med.artigo_clt && <Badge variant="outline">CLT {med.artigo_clt}</Badge>}
              {med.gravidade && <Badge variant={gravidadeVariant}>{med.gravidade}</Badge>}
              {med.dias_suspensao && <Badge variant="secondary">{med.dias_suspensao} dias</Badge>}
              <Badge variant="outline">
                Ocorrência: {format(new Date(med.data_ocorrencia + 'T00:00:00'), 'dd/MM/yyyy')}
              </Badge>
            </div>
            <div className="pt-2">
              <p className="text-xs text-muted-foreground">Descrição</p>
              <p className="whitespace-pre-line rounded-md border bg-muted/30 p-2 text-sm">{med.descricao}</p>
            </div>
            {med.pdf_url && (
              <Button asChild variant="outline" size="sm" className="mt-2">
                <a href={med.pdf_url} target="_blank" rel="noreferrer">
                  <FileText className="mr-2 h-4 w-4" /> Ver documento completo (PDF)
                </a>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sua manifestação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-start gap-2 text-sm">
              <Checkbox
                checked={aceite}
                onCheckedChange={(v) => setAceite(Boolean(v))}
                className="mt-0.5"
              />
              <span>
                Declaro ter lido o documento acima e reconheço que meu registro será legalmente vinculante,
                assinado eletronicamente com data, hora e endereço IP.
              </span>
            </label>

            <div className="space-y-2">
              <p className="text-xs font-medium">
                Motivo (obrigatório apenas para recusa, mín. 10 caracteres):
              </p>
              <Textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Descreva o motivo caso opte por recusar a assinatura..."
                rows={3}
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                className="flex-1"
                disabled={!aceite || enviando}
                onClick={() => registrar('ciencia')}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {enviando ? 'Registrando...' : 'Dar Ciência'}
              </Button>
              <Button
                className="flex-1"
                variant="destructive"
                disabled={!aceite || enviando || motivo.trim().length < 10}
                onClick={() => registrar('recusa')}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Recusar Assinatura
              </Button>
            </div>
          </CardContent>
        </Card>

        {data.expires_at && (
          <p className="text-center text-xs text-muted-foreground">
            Link válido até {format(new Date(data.expires_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </p>
        )}
      </div>
    </div>
  );
}
