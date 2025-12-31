/**
 * Botão de login com Passkey/Biometria
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Fingerprint, Loader2 } from 'lucide-react';
import { webAuthnService } from '@/services/WebAuthnService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface PasskeyLoginButtonProps {
  onSuccess?: () => void;
  className?: string;
}

export function PasskeyLoginButton({ onSuccess, className }: PasskeyLoginButtonProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSupport = async () => {
      const supported = webAuthnService.isSupported();
      const platformAvailable = await webAuthnService.isPlatformAuthenticatorAvailable();
      setIsSupported(supported && platformAvailable);
    };
    checkSupport();
  }, []);

  const handlePasskeyLogin = async () => {
    setIsLoading(true);
    try {
      const result = await webAuthnService.authenticate();

      if (result.success && result.userId) {
        // Verificar se há sessão ativa
        const { data: sessionData } = await supabase.auth.getSession();

        if (!sessionData.session) {
          // O usuário precisa estar logado para usar passkeys como 2FA
          toast.error('Faça login com email/senha primeiro para usar passkeys');
          return;
        }

        toast.success('Login biométrico realizado com sucesso!');
        onSuccess?.();
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Falha na autenticação biométrica');
      }
    } catch (error) {
      console.error('Erro no login com passkey:', error);
      toast.error('Erro na autenticação biométrica');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handlePasskeyLogin}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Fingerprint className="h-4 w-4 mr-2" />
      )}
      Entrar com Biometria
    </Button>
  );
}

export default PasskeyLoginButton;
