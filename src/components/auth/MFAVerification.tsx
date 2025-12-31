/**
 * Componente para verificação MFA no login
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Loader2 } from 'lucide-react';

interface MFAVerificationProps {
  onVerify: (code: string) => Promise<boolean>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function MFAVerification({ onVerify, onCancel, isLoading = false }: MFAVerificationProps) {
  const [code, setCode] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await onVerify(code);
    if (!success) {
      setError('Código inválido. Tente novamente.');
      setCode('');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle>Verificação de Dois Fatores</CardTitle>
        <CardDescription>
          {useBackupCode
            ? 'Digite um dos seus códigos de backup'
            : 'Digite o código do seu aplicativo autenticador'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder={useBackupCode ? 'XXXXXXXX' : '000000'}
              value={code}
              onChange={(e) => {
                const value = useBackupCode
                  ? e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                  : e.target.value.replace(/\D/g, '');
                setCode(value.slice(0, useBackupCode ? 8 : 6));
                setError('');
              }}
              className="text-center text-2xl tracking-widest"
              maxLength={useBackupCode ? 8 : 6}
              autoComplete="one-time-code"
              autoFocus
            />
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={code.length < (useBackupCode ? 8 : 6) || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            Verificar
          </Button>

          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="link"
              className="text-sm"
              onClick={() => {
                setUseBackupCode(!useBackupCode);
                setCode('');
                setError('');
              }}
            >
              {useBackupCode
                ? 'Usar código do aplicativo'
                : 'Usar código de backup'
              }
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default MFAVerification;
