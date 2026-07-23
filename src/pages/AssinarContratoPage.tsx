import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, ShieldCheck, FileSignature, AlertTriangle, Ban, Clock, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface ContratoInfo {
  contrato_id: string;
  status: string;
  sha256: string | null;
  data_inicio: string | null;
  data_fim: string | null;
  requer_cpf: boolean;
  expira_em: string;
}

function formatCpf(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export default function AssinarContratoPage() {
  const params = useParams<{ token: string }>();
  const [sp] = useSearchParams();
  const token = params.token || sp.get('token') || '';

  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<ContratoInfo | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [erroTipo, setErroTipo] = useState<'revogado' | 'expirado' | 'usado' | 'invalido' | 'generico' | null>(null);


  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [aceite, setAceite] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [assinado, setAssinado] = useState<{ hash: string; em: string } | null>(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      if (!token || token.length < 16) {
        setErro('Token de assinatura inválido.');
        setErroTipo('invalido');
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase.rpc('contrato_consultar_por_token' as never, {
          p_token: token,
        } as never);
        if (cancel) return;
        if (error) throw error;
        setInfo(data as unknown as ContratoInfo);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Não foi possível carregar o contrato.';
        const low = msg.toLowerCase();
        if (low.includes('revog')) setErroTipo('revogado');
        else if (low.includes('expir') || low.includes('venc')) setErroTipo('expirado');
        else if (low.includes('usad') || low.includes('assinad') || low.includes('já')) setErroTipo('usado');
        else if (low.includes('inválid') || low.includes('não encontr')) setErroTipo('invalido');
        else setErroTipo('generico');
        setErro(msg);
      } finally {
        if (!cancel) setLoading(false);
      }

    })();
    return () => {
      cancel = true;
    };
  }, [token]);

  const canSubmit = useMemo(
    () => aceite && nome.trim().length >= 5 && cpf.replace(/\D/g, '').length === 11,
    [aceite, nome, cpf]
  );

  async function handleAssinar() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      // best-effort captura de IP público
      let ip: string | null = null;
      try {
        const r = await fetch('https://api.ipify.org?format=json');
        const j = await r.json();
        ip = j.ip ?? null;
      } catch {
        /* silencioso */
      }
      const { data, error } = await supabase.rpc('contrato_assinar_por_token' as never, {
        p_token: token,
        p_cpf: cpf.replace(/\D/g, ''),
        p_nome_completo: nome.trim(),
        p_ip: ip,
        p_user_agent: navigator.userAgent,
      } as never);
      if (error) throw error;
      const res = data as unknown as { assinatura_hash: string; assinado_em: string };
      setAssinado({ hash: res.assinatura_hash, em: res.assinado_em });
      toast.success('Contrato assinado com sucesso!');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Falha ao assinar contrato.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-1/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-xl">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Não foi possível abrir o contrato</AlertTitle>
          <AlertDescription>{erro}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (assinado) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-xl border-primary/40">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7 text-primary" />
            </div>
            <CardTitle>Contrato assinado</CardTitle>
            <CardDescription>
              Sua assinatura eletrônica foi registrada com validade jurídica (MP 2.200-2/2001).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-md border p-3 bg-muted/30">
              <p className="text-muted-foreground text-xs">Hash de assinatura (SHA-256)</p>
              <p className="font-mono break-all text-xs">{assinado.hash}</p>
            </div>
            <div className="rounded-md border p-3 bg-muted/30">
              <p className="text-muted-foreground text-xs">Data e hora</p>
              <p>{new Date(assinado.em).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Guarde este comprovante. Uma cópia foi arquivada na empresa contratante e pode ser
              auditada externamente.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!info) return <></>;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileSignature className="h-5 w-5 text-primary" />
            <CardTitle>Assinatura Eletrônica de Contrato</CardTitle>
          </div>
          <CardDescription>
            Confirme seus dados abaixo para assinar. Documento com validade jurídica conforme MP
            2.200-2/2001.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border bg-muted/30 p-3 text-xs space-y-1">
            {info.data_inicio && (
              <p>
                <span className="text-muted-foreground">Início da vigência: </span>
                {new Date(info.data_inicio).toLocaleDateString('pt-BR')}
              </p>
            )}
            {info.data_fim && (
              <p>
                <span className="text-muted-foreground">Fim previsto: </span>
                {new Date(info.data_fim).toLocaleDateString('pt-BR')}
              </p>
            )}
            {info.sha256 && (
              <p className="break-all">
                <span className="text-muted-foreground">Hash do documento: </span>
                <span className="font-mono">{info.sha256}</span>
              </p>
            )}
            <p>
              <span className="text-muted-foreground">Token válido até: </span>
              {new Date(info.expira_em).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
            </p>
          </div>

          <div>
            <Label htmlFor="nome">Nome completo</Label>
            <Input
              id="nome"
              autoComplete="name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Como consta no documento"
            />
          </div>

          <div>
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              inputMode="numeric"
              autoComplete="off"
              value={cpf}
              onChange={(e) => setCpf(formatCpf(e.target.value))}
              placeholder="000.000.000-00"
              maxLength={14}
            />
          </div>

          <label className="flex items-start gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="mt-1"
              checked={aceite}
              onChange={(e) => setAceite(e.target.checked)}
            />
            <span>
              Declaro que li o contrato disponibilizado e aceito seus termos. Reconheço que esta
              assinatura eletrônica tem validade jurídica e que meu IP e navegador serão registrados
              para fins de auditoria.
            </span>
          </label>

          <Button
            className="w-full"
            disabled={!canSubmit || submitting}
            onClick={handleAssinar}
          >
            <ShieldCheck className="h-4 w-4 mr-2" />
            {submitting ? 'Assinando…' : 'Assinar contrato'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
