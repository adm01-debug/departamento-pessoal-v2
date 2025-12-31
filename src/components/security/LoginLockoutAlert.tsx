import { memo, useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lock, Clock } from 'lucide-react';

interface LoginLockoutAlertProps {
  lockedUntil: Date | null;
  remainingSeconds: number;
  attempts: number;
  onExpire?: () => void;
}

export const LoginLockoutAlert = memo(function LoginLockoutAlert({
  lockedUntil,
  remainingSeconds: initialSeconds,
  attempts,
  onExpire
}: LoginLockoutAlertProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);

  useEffect(() => {
    setRemainingSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      onExpire?.();
      return;
    }

    const timer = setInterval(() => {
      setRemainingSeconds(prev => {
        const newValue = prev - 1;
        if (newValue <= 0) {
          onExpire?.();
        }
        return newValue;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds, onExpire]);

  if (remainingSeconds <= 0) return null;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins} minuto${mins !== 1 ? 's' : ''} e ${secs} segundo${secs !== 1 ? 's' : ''}`;
    }
    return `${secs} segundo${secs !== 1 ? 's' : ''}`;
  };

  return (
    <Alert variant="destructive" className="mb-4">
      <Lock className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">
        Conta Bloqueada Temporariamente
      </AlertTitle>
      <AlertDescription className="space-y-2">
        <p>
          Sua conta foi bloqueada após {attempts} tentativas de login falhadas.
        </p>
        <p className="flex items-center gap-1 font-medium">
          <Clock className="h-4 w-4" />
          Tempo restante: {formatTime(remainingSeconds)}
        </p>
        <p className="text-xs opacity-80">
          O tempo de bloqueio aumenta exponencialmente a cada tentativa falhada.
        </p>
      </AlertDescription>
    </Alert>
  );
});

export default LoginLockoutAlert;
