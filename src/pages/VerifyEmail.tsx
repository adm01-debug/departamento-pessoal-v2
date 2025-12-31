/**
 * @fileoverview Página de verificação de e-mail
 * @module pages/VerifyEmail
 */
import { SEOHead } from '@/components/SEOHead';
import { useState, memo, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Mail, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const VerifyEmail = memo(function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('loading');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    const type = searchParams.get('type');

    if (type === 'email_confirmation' || token) {
      // Supabase handles verification automatically via URL
      setStatus('success');
    } else if (user?.email_confirmed_at) {
      setStatus('success');
    } else if (user) {
      setStatus('pending');
    } else {
      setStatus('pending');
    }
  }, [searchParams, user]);

  const handleResendEmail = async () => {
    if (!user?.email) {
      toast.error('E-mail não encontrado');
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });

      if (error) {
        toast.error('Erro ao reenviar e-mail');
      } else {
        toast.success('E-mail de verificação reenviado!');
      }
    } catch (err) {
      toast.error('Erro inesperado');
    } finally {
      setIsResending(false);
    }
  };

  if (status === 'loading') {
    return (
      <>
        <SEOHead title="Verificando E-mail" description="Verificando seu e-mail" />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
          <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm shadow-xl">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Verificando seu e-mail...</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (status === 'success') {
    return (
      <>
        <SEOHead title="E-mail Verificado" description="Seu e-mail foi verificado com sucesso" />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
          <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <CardTitle className="text-2xl font-display">E-mail Verificado!</CardTitle>
              <CardDescription>
                Sua conta foi verificada com sucesso. Você já pode acessar o sistema.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate('/')}>
                Acessar o sistema
              </Button>
            </CardFooter>
          </Card>
        </div>
      </>
    );
  }

  if (status === 'error') {
    return (
      <>
        <SEOHead title="Erro na Verificação" description="Houve um problema ao verificar seu e-mail" />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
          <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-destructive" />
                </div>
              </div>
              <CardTitle className="text-2xl font-display">Erro na Verificação</CardTitle>
              <CardDescription>
                O link de verificação é inválido ou expirou. Solicite um novo e-mail.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full" onClick={handleResendEmail} disabled={isResending}>
                {isResending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                Reenviar e-mail de verificação
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/auth">Voltar ao login</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </>
    );
  }

  // Pending status
  return (
    <>
      <SEOHead title="Verificar E-mail" description="Verifique seu e-mail para continuar" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                <Mail className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-display">Verifique seu E-mail</CardTitle>
            <CardDescription>
              Enviamos um link de verificação para {user?.email || 'seu e-mail'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
              <p className="mb-2">📧 Verifique sua caixa de entrada e spam</p>
              <p className="mb-2">⏱️ O link expira em 24 horas</p>
              <p>🔒 Clique no link para ativar sua conta</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button 
              className="w-full" 
              variant="outline"
              onClick={handleResendEmail} 
              disabled={isResending}
            >
              {isResending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Reenviar e-mail
            </Button>
            <Button variant="ghost" className="w-full" asChild>
              <Link to="/auth">Voltar ao login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
});

export default VerifyEmail;
