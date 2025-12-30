import { SEOHead } from '@/components/SEOHead';
import { useState, memo, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { useSearchParams } from 'react-router-dom';
import { 
  Upload, FileText, PenTool, CheckCircle2, User, 
  FileCheck, AlertCircle, Loader2, Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AssinaturaDigitalModal } from '@/components/assinatura/AssinaturaDigitalModal';
import { MaskedInput } from '@/components/ui/masked-input';

interface TokenData {
  id: string;
  admissao_id: string;
  token: string;
  dados_preenchidos: boolean;
  documentos_enviados: boolean;
  contrato_gerado: boolean;
  contrato_assinado: boolean;
  data_expiracao: string;
  admissoes: {
    id: string;
    nome: string;
    cargo: string;
    departamento: string;
    cpf: string | null;
    data_nascimento: string | null;
    sexo: string | null;
    email: string | null;
    telefone: string | null;
    nome_mae: string | null;
    estado_civil: string | null;
  };
}

const DOCUMENTOS_NECESSARIOS = [
  { tipo: 'rg_frente', label: 'RG (Frente)', obrigatorio: true },
  { tipo: 'rg_verso', label: 'RG (Verso)', obrigatorio: true },
  { tipo: 'cpf', label: 'CPF', obrigatorio: true },
  { tipo: 'comprovante_residencia', label: 'Comprovante de Residência', obrigatorio: true },
  { tipo: 'foto_3x4', label: 'Foto 3x4', obrigatorio: true },
  { tipo: 'titulo_eleitor', label: 'Título de Eleitor', obrigatorio: false },
  { tipo: 'certificado_reservista', label: 'Certificado de Reservista', obrigatorio: false },
  { tipo: 'carteira_trabalho', label: 'Carteira de Trabalho', obrigatorio: false },
  { tipo: 'certidao_nascimento_filhos', label: 'Certidão de Nascimento dos Filhos', obrigatorio: false },
];

const ContratacaoDigital = memo(function ContratacaoDigital() {
  useEffect(() => { document.title = 'Contratação Digital | DP System'; }, []);

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [expired, setExpired] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [assinarModalOpen, setAssinarModalOpen] = useState(false);
  
  // Form state para dados pessoais
  const [formData, setFormData] = useState({
    cpf: '',
    data_nascimento: '',
    sexo: '',
    email: '',
    telefone: '',
    nome_mae: '',
    estado_civil: '',
    rg: '',
    rg_orgao: '',
    pis: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    uf: '',
    cep: '',
  });

  // Documentos enviados
  const [documentosEnviados, setDocumentosEnviados] = useState<Record<string, { url: string; nome: string }>>({});
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      loadTokenData();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadTokenData = async () => {
    try {
      const { data, error } = await supabase
        .from('admissao_tokens')
        .select(`
          *,
          admissoes (*)
        `)
        .eq('token', token)
        .single();

      if (error) throw error;

      if (!data) {
        setExpired(true);
        return;
      }

      // Check expiration
      if (new Date(data.data_expiracao) < new Date()) {
        setExpired(true);
        return;
      }

      setTokenData(data as TokenData);
      
      // Preencher form com dados existentes
      if (data.admissoes) {
        setFormData(prev => ({
          ...prev,
          cpf: data.admissoes.cpf ?? '',
          data_nascimento: data.admissoes.data_nascimento ?? '',
          sexo: data.admissoes.sexo ?? '',
          email: data.admissoes.email ?? '',
          telefone: data.admissoes.telefone ?? '',
          nome_mae: data.admissoes.nome_mae ?? '',
          estado_civil: data.admissoes.estado_civil ?? '',
        }));
      }

      // Determinar step atual
      if (data.contrato_assinado) {
        setCurrentStep(4);
      } else if (data.documentos_enviados) {
        setCurrentStep(3);
      } else if (data.dados_preenchidos) {
        setCurrentStep(2);
      }

      // Carregar documentos já enviados
      const { data: docs } = await supabase
        .from('documentos_admissao')
        .select('*')
        .eq('admissao_id', data.admissao_id);

      if (docs) {
        const docsMap: Record<string, { url: string; nome: string }> = {};
        docs.forEach((doc: unknown) => {
          docsMap[doc.tipo] = { url: doc.url, nome: doc.nome_arquivo };
        });
        setDocumentosEnviados(docsMap);
      }
    } catch (error) {
      logger.error('Erro ao carregar dados:', error);
      setExpired(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDadosPessoais = async () => {
    if (!tokenData) return;
    setSaving(true);

    try {
      // Atualizar dados na admissão
      const { error: admError } = await supabase
        .from('admissoes')
        .update({
          cpf: formData.cpf,
          data_nascimento: formData.data_nascimento,
          sexo: formData.sexo,
          email: formData.email,
          telefone: formData.telefone,
          nome_mae: formData.nome_mae,
          estado_civil: formData.estado_civil,
        })
        .eq('id', tokenData.admissao_id);

      if (admError) throw admError;

      // Atualizar token
      const { error: tokenError } = await supabase
        .from('admissao_tokens')
        .update({ dados_preenchidos: true })
        .eq('id', tokenData.id);

      if (tokenError) throw tokenError;

      toast.success('Dados salvos com sucesso!');
      setTokenData(prev => prev ? { ...prev, dados_preenchidos: true } : null);
      setCurrentStep(2);
    } catch (error) {
      logger.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar dados');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadDocumento = async (tipo: string, file: File) => {
    if (!tokenData) return;
    setUploading(tipo);

    try {
      const fileName = `${tokenData.admissao_id}/${tipo}_${Date.now()}_${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documentos-admissao')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documentos-admissao')
        .getPublicUrl(fileName);

      // Salvar referência no banco
      const { error: dbError } = await supabase
        .from('documentos_admissao')
        .insert({
          admissao_id: tokenData.admissao_id,
          tipo,
          nome_arquivo: file.name,
          url: publicUrl,
          tamanho_bytes: file.size,
        });

      if (dbError) throw dbError;

      setDocumentosEnviados(prev => ({
        ...prev,
        [tipo]: { url: publicUrl, nome: file.name }
      }));

      toast.success('Documento enviado!');
    } catch (error) {
      logger.error('Erro no upload:', error);
      toast.error('Erro ao enviar documento');
    } finally {
      setUploading(null);
    }
  };

  // Verificar documentos obrigatórios faltando
  const documentosObrigatoriosFaltando = DOCUMENTOS_NECESSARIOS
    .filter(d => d.obrigatorio && !documentosEnviados[d.tipo]);

  const todosDocumentosObrigatoriosEnviados = documentosObrigatoriosFaltando.length === 0;

  const handleConcluirDocumentos = async () => {
    if (!tokenData) return;
    
    // Verificar documentos obrigatórios (bloqueio real)
    if (!todosDocumentosObrigatoriosEnviados) {
      toast.error(`Documentos obrigatórios faltando: ${documentosObrigatoriosFaltando.map(d => d.label).join(', ')}`);
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('admissao_tokens')
        .update({ documentos_enviados: true, contrato_gerado: true })
        .eq('id', tokenData.id);

      if (error) throw error;

      toast.success('Documentos enviados! Contrato pronto para assinatura.');
      setTokenData(prev => prev ? { ...prev, documentos_enviados: true, contrato_gerado: true } : null);
      setCurrentStep(3);
    } catch (error) {
      logger.error('Erro:', error);
      toast.error('Erro ao finalizar');
    } finally {
      setSaving(false);
    }
  };

  const handleAssinaturaSalva = async (assinaturaBase64: string) => {
    if (!tokenData) return;
    
    try {
      // Capturar IP do cliente
      let ipAddress: string | null = null;
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        ipAddress = ipData.ip;
      } catch (err) {
        logger.warn('Não foi possível capturar o IP:', err);
      }

      // Converter base64 para blob e fazer upload no Storage
      const base64Data = assinaturaBase64.replace(/^data:image\/\w+;base64,/, '');
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });

      const fileName = `${tokenData.admissao_id}/assinatura_${Date.now()}.png`;
      
      const { error: uploadError } = await supabase.storage
        .from('assinaturas')
        .upload(fileName, blob, { contentType: 'image/png' });

      if (uploadError) {
        logger.error('Erro no upload da assinatura:', uploadError);
        throw uploadError;
      }

      // Gerar signed URL (bucket privado)
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('assinaturas')
        .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 ano de validade

      if (signedUrlError) {
        logger.error('Erro ao gerar signed URL:', signedUrlError);
      }

      const assinaturaUrl = signedUrlData?.signedUrl || fileName;

      const { error } = await supabase
        .from('admissao_tokens')
        .update({
          contrato_assinado: true,
          assinatura_url: assinaturaUrl,
          ip_assinatura: ipAddress,
          assinado_em: new Date().toISOString(),
        })
        .eq('id', tokenData.id);

      if (error) throw error;

      // Atualizar etapa da admissão
      await supabase
        .from('admissoes')
        .update({ 
          etapa: 'esocial',
          checklist_contrato_assinado: true 
        })
        .eq('id', tokenData.admissao_id);

      toast.success('Contrato assinado com sucesso!');
      setTokenData(prev => prev ? { ...prev, contrato_assinado: true } : null);
      setCurrentStep(4);
    } catch (error) {
      logger.error('Erro ao assinar:', error);
      toast.error('Erro ao salvar assinatura');
    }
    
    setAssinarModalOpen(false);
  };

  const getProgress = () => {
    if (tokenData?.contrato_assinado) return 100;
    if (tokenData?.documentos_enviados) return 75;
    if (tokenData?.dados_preenchidos) return 50;
    return 25;
  };

  // Tela de carregamento
  if (loading) {
    return (
      <>
        <SEOHead title="Contratação Digital" description="Processo de contratação digital" />
        <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
      </>    );
  }

  // Token inválido ou não fornecido
  if (!token || expired || !tokenData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <AlertCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
            <CardTitle>Link Inválido ou Expirado</CardTitle>
            <CardDescription>
              {!token 
                ? 'Nenhum token de acesso foi fornecido.'
                : 'Este link de contratação digital expirou ou é inválido.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Entre em contato com o RH para solicitar um novo link.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Olá, {tokenData.admissoes.nome}!
              </h1>
              <p className="text-sm text-muted-foreground">
                Bem-vindo(a) ao processo de contratação digital
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progresso</span>
              <span className="text-sm text-muted-foreground">{getProgress()}%</span>
            </div>
            <Progress value={getProgress()} className="h-2" />
          </div>

          {/* Steps */}
          <div className="flex items-center justify-between mt-6">
            {[
              { step: 1, label: 'Dados Pessoais', icon: User },
              { step: 2, label: 'Documentos', icon: Upload },
              { step: 3, label: 'Contrato', icon: FileText },
              { step: 4, label: 'Conclusão', icon: CheckCircle2 },
            ].map(({ step, label, icon: Icon }) => (
              <div key={step} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  currentStep >= step 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep > step ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`text-xs ${currentStep >= step ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Step 1: Dados Pessoais */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Dados Pessoais
              </CardTitle>
              <CardDescription>
                Preencha seus dados pessoais para continuar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CPF *</Label>
                  <MaskedInput
                    mask="cpf"
                    value={formData.cpf}
                    onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                    placeholder="000.000.000-00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data de Nascimento *</Label>
                  <Input
                    type="date"
                    value={formData.data_nascimento}
                    onChange={(e) => setFormData(prev => ({ ...prev, data_nascimento: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sexo *</Label>
                  <Select value={formData.sexo} onValueChange={(v) => setFormData(prev => ({ ...prev, sexo: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Estado Civil *</Label>
                  <Select value={formData.estado_civil} onValueChange={(v) => setFormData(prev => ({ ...prev, estado_civil: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                      <SelectItem value="casado">Casado(a)</SelectItem>
                      <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                      <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                      <SelectItem value="uniao_estavel">União Estável</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="seu@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone *</Label>
                  <MaskedInput
                    mask="phone"
                    value={formData.telefone}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Nome da Mãe *</Label>
                  <Input
                    value={formData.nome_mae}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome_mae: e.target.value }))}
                    placeholder="Nome completo da mãe"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>RG</Label>
                  <Input
                    value={formData.rg}
                    onChange={(e) => setFormData(prev => ({ ...prev, rg: e.target.value }))}
                    placeholder="Número do RG"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Órgão Emissor</Label>
                  <Input
                    value={formData.rg_orgao}
                    onChange={(e) => setFormData(prev => ({ ...prev, rg_orgao: e.target.value }))}
                    placeholder="SSP/UF"
                  />
                </div>
                <div className="space-y-2">
                  <Label>PIS/PASEP</Label>
                  <Input
                    value={formData.pis}
                    onChange={(e) => setFormData(prev => ({ ...prev, pis: e.target.value }))}
                    placeholder="Número do PIS"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>CEP</Label>
                  <MaskedInput
                    mask="cep"
                    value={formData.cep}
                    onChange={(e) => setFormData(prev => ({ ...prev, cep: e.target.value }))}
                    placeholder="00000-000"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Endereço</Label>
                  <Input
                    value={formData.endereco}
                    onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                    placeholder="Rua, Avenida..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Número</Label>
                  <Input
                    value={formData.numero}
                    onChange={(e) => setFormData(prev => ({ ...prev, numero: e.target.value }))}
                    placeholder="Nº"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bairro</Label>
                  <Input
                    value={formData.bairro}
                    onChange={(e) => setFormData(prev => ({ ...prev, bairro: e.target.value }))}
                    placeholder="Bairro"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input
                    value={formData.cidade}
                    onChange={(e) => setFormData(prev => ({ ...prev, cidade: e.target.value }))}
                    placeholder="Cidade"
                  />
                </div>
                <div className="space-y-2">
                  <Label>UF</Label>
                  <Input
                    value={formData.uf}
                    onChange={(e) => setFormData(prev => ({ ...prev, uf: e.target.value }))}
                    placeholder="UF"
                    maxLength={2}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSaveDadosPessoais} 
                  disabled={saving || !formData.cpf || !formData.nome_mae}
                >
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Salvar e Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Documentos */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Envio de Documentos
              </CardTitle>
              <CardDescription>
                Envie os documentos necessários para sua contratação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {DOCUMENTOS_NECESSARIOS.map((doc) => (
                <div 
                  key={doc.tipo}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    {documentosEnviados[doc.tipo] ? (
                      <div className="w-10 h-10 rounded-lg bg-success/10 text-success flex items-center justify-center">
                        <FileCheck className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sm">
                        {doc.label}
                        {doc.obrigatorio && <span className="text-destructive ml-1">*</span>}
                      </p>
                      {documentosEnviados[doc.tipo] && (
                        <p className="text-xs text-muted-foreground">
                          {documentosEnviados[doc.tipo].nome}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {documentosEnviados[doc.tipo] ? (
                      <Badge variant="outline" className="text-success border-success">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Enviado
                      </Badge>
                    ) : (
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadDocumento(doc.tipo, file);
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          disabled={uploading === doc.tipo}
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={uploading === doc.tipo}
                        >
                          {uploading === doc.tipo ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Camera className="w-4 h-4 mr-1" />
                              Enviar
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {!todosDocumentosObrigatoriosEnviados && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    Documentos obrigatórios faltando: {documentosObrigatoriosFaltando.map(d => d.label).join(', ')}
                  </span>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Voltar
                </Button>
                <Button 
                  onClick={handleConcluirDocumentos} 
                  disabled={saving || !todosDocumentosObrigatoriosEnviados}
                >
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Concluir Documentos
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Contrato */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Contrato de Trabalho
              </CardTitle>
              <CardDescription>
                Revise e assine digitalmente seu contrato de trabalho
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div id="main-content" className="p-6 rounded-lg border bg-muted/30">
                <h3 className="font-semibold mb-4">Resumo do Contrato</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nome:</span>
                    <p className="font-medium">{tokenData.admissoes.nome}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cargo:</span>
                    <p className="font-medium">{tokenData.admissoes.cargo}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Departamento:</span>
                    <p className="font-medium">{tokenData.admissoes.departamento}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CPF:</span>
                    <p className="font-medium">{tokenData.admissoes.cpf || formData.cpf}</p>
                  </div>
                </div>
              </div>

              <div className="text-center py-8">
                <PenTool className="w-12 h-12 mx-auto text-primary mb-4" />
                <h3 className="font-semibold mb-2">Assinatura Digital</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Clique no botão abaixo para assinar digitalmente seu contrato de trabalho
                </p>
                <Button size="lg" onClick={() => setAssinarModalOpen(true)}>
                  <PenTool className="w-4 h-4 mr-2" />
                  Assinar Contrato
                </Button>
              </div>

              <div className="flex justify-start">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Voltar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Conclusão */}
        {currentStep === 4 && (
          <Card>
            <CardHeader className="text-center">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <CardTitle className="text-2xl text-success">Contratação Concluída!</CardTitle>
              <CardDescription className="text-base">
                Parabéns, {tokenData.admissoes.nome}! Seu processo de contratação foi finalizado com sucesso.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 rounded-lg border bg-muted/30">
                <h3 className="font-semibold mb-4">Próximos Passos</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    <span>Seus dados e documentos foram recebidos pelo RH</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    <span>Seu contrato foi assinado digitalmente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <span>Aguarde o contato do RH com mais informações sobre sua data de início</span>
                  </li>
                </ul>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Você pode fechar esta página. Se precisar de ajuda, entre em contato com o RH.
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de Assinatura */}
      <AssinaturaDigitalModal
        open={assinarModalOpen}
        onOpenChange={setAssinarModalOpen}
        documento={`Contrato de Trabalho - ${tokenData.admissoes.nome}`}
        onAssinaturaSalva={handleAssinaturaSalva}
      />
    </div>
    </>
  );
});
