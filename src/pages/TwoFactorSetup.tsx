/**
 * @fileoverview Página de configuração de autenticação de dois fatores
 * @module pages/TwoFactorSetup
 */
import { SEOHead } from '@/components/SEOHead';
import { useState, memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Shield, Smartphone, Key, CheckCircle, Copy, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TwoFactorSetup = memo(function TwoFactorSetup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<'intro' | 'setup' | 'verify' | 'backup' | 'complete'>('intro');
  const [isLoading, setIsLoading] = useState(false);
  const [factorId, setFactorId] = useState<string>('');
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [verifyCode, setVerifyCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const handleStartSetup = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Authenticator App',
      });

      if (error) {
        toast.error('Erro ao iniciar configuração MFA');
        return;
      }

      if (data) {
        setFactorId(data.id);
        setQrCode(data.totp.qr_code);
        setSecret(data.totp.secret);
        setStep('setup');
      }
    } catch (err) {
      toast.error('Erro inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (verifyCode.length !== 6) {
      toast.error('Digite o código de 6 dígitos');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: verifyCode,
      });

      if (error) {
        toast.error('Código inválido');
        return;
      }

      // Gerar códigos de backup
      const codes = Array.from({ length: 10 }, () => 
        Math.random().toString(36).substring(2, 8).toUpperCase()
      );
      setBackupCodes(codes);

      // Salvar configuração MFA no banco
      await supabase.from('user_mfa').upsert({
        user_id: user?.id,
        mfa_enabled: true,
        mfa_type: 'totp',
        backup_codes: codes,
        verified_at: new Date().toISOString(),
      });

      setStep('backup');
      toast.success('MFA ativado com sucesso!');
    } catch (err) {
      toast.error('Erro ao verificar código');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado!');
  };

  const handleComplete = () => {
    setStep('complete');
  };

  if (step === 'complete') {
    return (
      <>
        <SEOHead title="MFA Configurado" description="Autenticação de dois fatores ativada" />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
          <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <CardTitle className="text-2xl font-display">MFA Ativado!</CardTitle>
              <CardDescription>
                Sua conta agora está protegida com autenticação de dois fatores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-sm">
                <p className="text-green-700 dark:text-green-300">
                  ✅ Na próxima vez que fizer login, você precisará informar o código do seu aplicativo autenticador
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate('/perfil')}>
                Voltar ao perfil
              </Button>
            </CardFooter>
          </Card>
        </div>
      </>
    );
  }

  if (step === 'backup') {
    return (
      <>
        <SEOHead title="Códigos de Backup" description="Salve seus códigos de recuperação" />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
          <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                  <Key className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="text-2xl font-display">Códigos de Backup</CardTitle>
              <CardDescription>
                Salve estes códigos em um local seguro. Use-os se perder acesso ao seu autenticador
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, idx) => (
                    <div key={idx} className="font-mono text-sm bg-background rounded px-2 py-1 text-center">
                      {code}
                    </div>
                  ))}
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => copyToClipboard(backupCodes.join('\n'))}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar todos os códigos
              </Button>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-sm">
                <p className="text-amber-700 dark:text-amber-300">
                  ⚠️ Cada código só pode ser usado uma vez. Guarde-os em local seguro!
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleComplete}>
                Já salvei meus códigos
              </Button>
            </CardFooter>
          </Card>
        </div>
      </>
    );
  }

  if (step === 'setup') {
    return (
      <>
        <SEOHead title="Configurar MFA" description="Escaneie o QR Code com seu autenticador" />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
          <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-display">Configurar Autenticador</CardTitle>
              <CardDescription>
                Escaneie o QR Code com seu aplicativo autenticador
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="qrcode">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="qrcode">QR Code</TabsTrigger>
                  <TabsTrigger value="manual">Manual</TabsTrigger>
                </TabsList>
                <TabsContent value="qrcode" className="space-y-4">
                  <div className="flex justify-center p-4 bg-white rounded-lg">
                    {qrCode && (
                      <img src={qrCode} alt="QR Code MFA" className="w-48 h-48" />
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="manual" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Chave secreta</Label>
                    <div className="flex gap-2">
                      <Input value={secret} readOnly className="font-mono text-sm" />
                      <Button variant="outline" size="icon" onClick={() => copyToClipboard(secret)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="space-y-2">
                <Label>Código de verificação</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                  className="text-center text-2xl tracking-widest font-mono"
                />
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep('intro')}>
                Cancelar
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleVerify} 
                disabled={isLoading || verifyCode.length !== 6}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Verificar
              </Button>
            </CardFooter>
          </Card>
        </div>
      </>
    );
  }

  // Intro step
  return (
    <>
      <SEOHead title="Configurar 2FA" description="Ative a autenticação de dois fatores" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-display">Autenticação de Dois Fatores</CardTitle>
            <CardDescription>
              Adicione uma camada extra de segurança à sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Smartphone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Aplicativo Autenticador</p>
                  <p className="text-xs text-muted-foreground">
                    Use Google Authenticator, Authy ou similar
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <QrCode className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Escaneie o QR Code</p>
                  <p className="text-xs text-muted-foreground">
                    Configure rapidamente escaneando o código
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Key className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Códigos de Backup</p>
                  <p className="text-xs text-muted-foreground">
                    Receba códigos de recuperação para emergências
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full" onClick={handleStartSetup} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Começar configuração
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => navigate(-1)}>
              Voltar
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
});

export default TwoFactorSetup;
