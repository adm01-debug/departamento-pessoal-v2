import { PageTitle } from '@/components/PageTitle';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  FileText, Upload, CheckCircle2, User, FileCheck, PenTool,
  AlertCircle, ArrowRight, ArrowLeft, Loader2, ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 'dados', label: 'Dados Pessoais', icon: User },
  { id: 'documentos', label: 'Documentos', icon: Upload },
  { id: 'contrato', label: 'Contrato', icon: FileText },
  { id: 'assinatura', label: 'Assinatura', icon: PenTool },
] as const;

function TokenInput({ onValidToken }: { onValidToken: (token: string) => void }) {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    const { data, error: err } = await supabase
      .from('admissao_tokens')
      .select('*')
      .eq('token', token)
      .maybeSingle();

    if (err || !data) {
      setError('Token inválido ou expirado.');
    } else if (new Date(data.data_expiracao) < new Date()) {
      setError('Este link expirou. Solicite um novo ao RH.');
    } else {
      onValidToken(token);
    }
    setLoading(false);
  };

  return (
    <>
    <PageTitle title="Contratação" description="Portal de contratação" />
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Contratação Digital</CardTitle>
          <CardDescription>Insira o código recebido por e-mail ou WhatsApp para iniciar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Código de Acesso</Label>
            <Input
              placeholder="Ex: abc123-def456"
              value={token}
              onChange={e => setToken(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
            {error && <p className="text-sm text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
          </div>
          <Button className="w-full" onClick={handleSubmit} disabled={!token || loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Acessar
          </Button>
        </CardContent>
      </Card>
    </div>
    </>
  );
}

function ContratacaoWorkflow({ token }: { token: string }) {
  const [step, setStep] = useState(0);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    nome_completo: '', cpf: '', data_nascimento: '', email: '', telefone: '',
    cep: '', logradouro: '', numero: '', bairro: '', cidade: '', uf: '',
  });

  const { data: tokenData } = useQuery({
    queryKey: ['contratacao-token', token],
    queryFn: async () => {
      const { data } = await supabase
        .from('admissao_tokens')
        .select('*, admissoes(*)')
        .eq('token', token)
        .maybeSingle();
      return data;
    },
  });

  const saveDados = useMutation({
    mutationFn: async () => {
      if (!tokenData?.id) return;
      await supabase.from('admissao_tokens').update({
        dados_preenchidos: true,
        updated_at: new Date().toISOString(),
      }).eq('id', tokenData.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratacao-token'] });
      toast.success('Dados salvos com sucesso!');
      setStep(1);
    },
  });

  const markDocsUploaded = useMutation({
    mutationFn: async () => {
      if (!tokenData?.id) return;
      await supabase.from('admissao_tokens').update({
        documentos_enviados: true,
        updated_at: new Date().toISOString(),
      }).eq('id', tokenData.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratacao-token'] });
      toast.success('Documentos registrados!');
      setStep(2);
    },
  });

  const signContract = useMutation({
    mutationFn: async () => {
      if (!tokenData?.id) return;
      await supabase.from('admissao_tokens').update({
        contrato_assinado: true,
        assinado_em: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).eq('id', tokenData.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratacao-token'] });
      toast.success('Contrato assinado digitalmente!');
      setStep(3);
    },
  });

  const progress = ((step + (step === 3 ? 1 : 0)) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Bem-vindo(a)!</h1>
          <p className="text-muted-foreground">Complete as etapas abaixo para finalizar sua contratação</p>
        </div>

        {/* Stepper */}
        <div className="space-y-3">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between">
            {STEPS.map((s, i) => (
              <button key={s.id} onClick={() => i <= step && setStep(i)}
                className={cn("flex flex-col items-center gap-1 text-xs transition-colors",
                  i <= step ? "text-primary" : "text-muted-foreground"
                )}>
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all",
                  i < step ? "bg-primary border-primary text-primary-foreground" :
                  i === step ? "border-primary text-primary" : "border-muted text-muted-foreground"
                )}>
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                </div>
                <span className="hidden sm:block">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Dados Pessoais</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'nome_completo', label: 'Nome Completo', col: 2 },
                    { key: 'cpf', label: 'CPF' },
                    { key: 'data_nascimento', label: 'Data de Nascimento', type: 'date' },
                    { key: 'email', label: 'E-mail', type: 'email' },
                    { key: 'telefone', label: 'Telefone' },
                    { key: 'cep', label: 'CEP' },
                    { key: 'logradouro', label: 'Logradouro' },
                    { key: 'numero', label: 'Número' },
                    { key: 'bairro', label: 'Bairro' },
                    { key: 'cidade', label: 'Cidade' },
                    { key: 'uf', label: 'UF' },
                  ].map(f => (
                    <div key={f.key} className={cn("space-y-1", f.col === 2 && "md:col-span-2")}>
                      <Label>{f.label}</Label>
                      <Input
                        type={(f as any).type || 'text'}
                        value={(formData as any)[f.key]}
                        onChange={e => setFormData(prev => ({ ...prev, [f.key]: e.target.value }))}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => saveDados.mutate()} disabled={saveDados.isPending}>
                    {saveDados.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Salvar e Continuar <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2"><Upload className="w-5 h-5 text-primary" /> Upload de Documentos</h2>
                <p className="text-sm text-muted-foreground">Envie os documentos obrigatórios para prosseguir.</p>
                <div className="grid gap-3">
                  {['RG ou CNH', 'CPF', 'Comprovante de Residência', 'Foto 3x4', 'CTPS Digital'].map(doc => (
                    <div key={doc} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{doc}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Upload className="w-3 h-3 mr-1" /> Enviar
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(0)}><ArrowLeft className="w-4 h-4 mr-2" /> Voltar</Button>
                  <Button onClick={() => markDocsUploaded.mutate()} disabled={markDocsUploaded.isPending}>
                    Continuar <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> Contrato de Trabalho</h2>
                <div className="p-6 rounded-lg border border-border bg-muted/20 min-h-[200px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground space-y-2">
                    <FileText className="w-12 h-12 mx-auto opacity-50" />
                    <p className="text-sm">Contrato gerado automaticamente</p>
                    <p className="text-xs">Cargo: <strong>{tokenData?.admissoes?.cargo || '—'}</strong></p>
                    <p className="text-xs">Salário: <strong>R$ {tokenData?.admissoes?.salario_proposto?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '—'}</strong></p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="w-4 h-4 mr-2" /> Voltar</Button>
                  <Button onClick={() => signContract.mutate()} disabled={signContract.isPending}>
                    <PenTool className="w-4 h-4 mr-2" /> Assinar Digitalmente
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center space-y-4 py-8">
                <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Contratação Concluída!</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Todos os documentos foram enviados e o contrato foi assinado digitalmente.
                  O RH entrará em contato com as próximas orientações.
                </p>
                <Badge variant="outline" className="text-success border-success">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Processo finalizado
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ContratacaoPage(): React.ReactElement {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token');
  const [validToken, setValidToken] = useState<string | null>(tokenFromUrl);

  if (!validToken) return <TokenInput onValidToken={setValidToken} />;
  return <ContratacaoWorkflow token={validToken} />;
}
