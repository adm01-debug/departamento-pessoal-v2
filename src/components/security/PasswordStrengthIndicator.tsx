import { useMemo, useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Check, X, AlertTriangle, Loader2, ShieldAlert, ShieldCheck } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
  checkLeakedPasswords?: boolean;
  className?: string;
  onStrengthChange?: (isStrong: boolean, isLeaked: boolean) => void;
}

interface PasswordRequirement {
  id: string;
  label: string;
  met: boolean;
  weight: number;
  required: boolean;
}

// Gera hash SHA-1 da senha
async function sha1(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

// Verifica se a senha foi vazada usando Have I Been Pwned API
async function checkLeakedPassword(password: string): Promise<{ leaked: boolean; count: number }> {
  if (!password || password.length < 4) {
    return { leaked: false, count: 0 };
  }

  try {
    const hash = await sha1(password);
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { 'Add-Padding': 'true' }
    });

    if (!response.ok) {
      console.error('Erro ao verificar senha vazada');
      return { leaked: false, count: 0 };
    }

    const text = await response.text();
    const lines = text.split('\n');

    for (const line of lines) {
      const [hashSuffix, count] = line.split(':');
      if (hashSuffix.trim() === suffix) {
        return { leaked: true, count: parseInt(count.trim(), 10) };
      }
    }

    return { leaked: false, count: 0 };
  } catch (error) {
    console.error('Erro ao verificar senha:', error);
    return { leaked: false, count: 0 };
  }
}

const getPasswordStrength = (password: string): { score: number; label: string; color: string; requirements: PasswordRequirement[] } => {
  const requirements: PasswordRequirement[] = [
    { id: 'min8', label: 'Mínimo 8 caracteres', met: password.length >= 8, weight: 25, required: true },
    { id: 'lowercase', label: 'Letra minúscula (a-z)', met: /[a-z]/.test(password), weight: 15, required: false },
    { id: 'uppercase', label: 'Letra maiúscula (A-Z)', met: /[A-Z]/.test(password), weight: 15, required: false },
    { id: 'number', label: 'Número (0-9)', met: /[0-9]/.test(password), weight: 15, required: false },
    { id: 'special', label: 'Caractere especial (!@#$%^&*)', met: /[!@#$%^&*(),.?":{}|<>\-_=+\[\]\\;'\/`~]/.test(password), weight: 20, required: true },
    { id: 'min12', label: 'Mínimo 12 caracteres (recomendado)', met: password.length >= 12, weight: 10, required: false },
  ];

  const score = requirements.reduce((acc, req) => acc + (req.met ? req.weight : 0), 0);
  const requiredMet = requirements.filter(r => r.required).every(r => r.met);

  let label = 'Muito fraca';
  let color = 'bg-destructive';

  if (!requiredMet) {
    label = 'Inválida';
    color = 'bg-destructive';
  } else if (score >= 85) {
    label = 'Muito forte';
    color = 'bg-green-500';
  } else if (score >= 70) {
    label = 'Forte';
    color = 'bg-green-400';
  } else if (score >= 50) {
    label = 'Média';
    color = 'bg-yellow-500';
  } else if (score >= 30) {
    label = 'Fraca';
    color = 'bg-orange-500';
  }

  return { score, label, color, requirements };
};

export function PasswordStrengthIndicator({ 
  password, 
  showRequirements = true,
  checkLeakedPasswords = true,
  className,
  onStrengthChange
}: PasswordStrengthIndicatorProps) {
  const { score, label, color, requirements } = useMemo(
    () => getPasswordStrength(password),
    [password]
  );

  const [leakCheck, setLeakCheck] = useState<{ checking: boolean; leaked: boolean; count: number }>({
    checking: false,
    leaked: false,
    count: 0
  });

  // Debounce para verificar senhas vazadas
  useEffect(() => {
    if (!checkLeakedPasswords || !password || password.length < 8) {
      setLeakCheck({ checking: false, leaked: false, count: 0 });
      return;
    }

    setLeakCheck(prev => ({ ...prev, checking: true }));

    const timer = setTimeout(async () => {
      const result = await checkLeakedPassword(password);
      setLeakCheck({ checking: false, ...result });
    }, 500);

    return () => clearTimeout(timer);
  }, [password, checkLeakedPasswords]);

  // Callback para informar o pai sobre o estado
  useEffect(() => {
    if (onStrengthChange) {
      const requiredMet = requirements.filter(r => r.required).every(r => r.met);
      const isStrong = requiredMet && score >= 50;
      onStrengthChange(isStrong, leakCheck.leaked);
    }
  }, [score, requirements, leakCheck.leaked, onStrengthChange]);

  if (!password) return null;

  const requiredMet = requirements.filter(r => r.required).every(r => r.met);

  return (
    <div className={cn('space-y-3', className)}>
      {/* Barra de progresso */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Força da senha</span>
          <span className={cn(
            'text-sm font-medium',
            score >= 70 && requiredMet ? 'text-green-500' : score >= 50 && requiredMet ? 'text-yellow-500' : 'text-destructive'
          )}>
            {label}
          </span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className={cn('h-full transition-all duration-300', color)}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Verificação de vazamento */}
      {checkLeakedPasswords && password.length >= 8 && (
        <div className={cn(
          'flex items-center gap-2 p-3 rounded-lg border transition-colors',
          leakCheck.checking 
            ? 'bg-muted/50 border-muted' 
            : leakCheck.leaked 
              ? 'bg-destructive/10 border-destructive/30' 
              : 'bg-green-500/10 border-green-500/30'
        )}>
          {leakCheck.checking ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Verificando se a senha foi vazada...</span>
            </>
          ) : leakCheck.leaked ? (
            <>
              <ShieldAlert className="h-5 w-5 text-destructive flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-destructive">Senha comprometida!</p>
                <p className="text-xs text-destructive/80">
                  Esta senha foi encontrada {leakCheck.count.toLocaleString('pt-BR')} vezes em vazamentos de dados. Escolha outra senha.
                </p>
              </div>
            </>
          ) : (
            <>
              <ShieldCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-green-600">Senha não encontrada em vazamentos conhecidos</span>
            </>
          )}
        </div>
      )}

      {/* Requisitos */}
      {showRequirements && (
        <div className="grid gap-1.5">
          {requirements.map((req) => (
            <div
              key={req.id}
              className={cn(
                'flex items-center gap-2 text-sm transition-colors',
                req.met ? 'text-green-500' : req.required ? 'text-destructive' : 'text-muted-foreground'
              )}
            >
              {req.met ? (
                <Check className="h-4 w-4 flex-shrink-0" />
              ) : (
                <X className={cn(
                  'h-4 w-4 flex-shrink-0',
                  req.required ? 'text-destructive' : 'text-muted-foreground/50'
                )} />
              )}
              <span>
                {req.label}
                {req.required && !req.met && <span className="text-destructive ml-1">*</span>}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Aviso se requisitos obrigatórios não atendidos */}
      {!requiredMet && password.length > 0 && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
          <p className="text-sm text-destructive">
            A senha deve ter no mínimo 8 caracteres e incluir pelo menos um caractere especial.
          </p>
        </div>
      )}
    </div>
  );
}

// Hook para usar a lógica de força de senha em outros lugares
export function usePasswordStrength(password: string) {
  return useMemo(() => getPasswordStrength(password), [password]);
}

// Hook para verificar senha vazada
export function useLeakedPasswordCheck(password: string, enabled = true) {
  const [state, setState] = useState<{ checking: boolean; leaked: boolean; count: number }>({
    checking: false,
    leaked: false,
    count: 0
  });

  const check = useCallback(async (pwd: string) => {
    if (!pwd || pwd.length < 8) {
      setState({ checking: false, leaked: false, count: 0 });
      return;
    }

    setState(prev => ({ ...prev, checking: true }));
    const result = await checkLeakedPassword(pwd);
    setState({ checking: false, ...result });
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const timer = setTimeout(() => {
      check(password);
    }, 500);

    return () => clearTimeout(timer);
  }, [password, enabled, check]);

  return state;
}
