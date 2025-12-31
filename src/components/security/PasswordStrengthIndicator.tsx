import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Check, X, AlertTriangle } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
  className?: string;
}

interface PasswordRequirement {
  label: string;
  met: boolean;
  weight: number;
}

const getPasswordStrength = (password: string): { score: number; label: string; color: string; requirements: PasswordRequirement[] } => {
  const requirements: PasswordRequirement[] = [
    { label: 'Mínimo 8 caracteres', met: password.length >= 8, weight: 20 },
    { label: 'Letra minúscula', met: /[a-z]/.test(password), weight: 15 },
    { label: 'Letra maiúscula', met: /[A-Z]/.test(password), weight: 15 },
    { label: 'Número', met: /[0-9]/.test(password), weight: 15 },
    { label: 'Caractere especial (!@#$%^&*)', met: /[!@#$%^&*(),.?":{}|<>]/.test(password), weight: 20 },
    { label: 'Mínimo 12 caracteres', met: password.length >= 12, weight: 15 },
  ];

  const score = requirements.reduce((acc, req) => acc + (req.met ? req.weight : 0), 0);

  let label = 'Muito fraca';
  let color = 'bg-destructive';

  if (score >= 85) {
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
  className 
}: PasswordStrengthIndicatorProps) {
  const { score, label, color, requirements } = useMemo(
    () => getPasswordStrength(password),
    [password]
  );

  if (!password) return null;

  return (
    <div className={cn('space-y-3', className)}>
      {/* Barra de progresso */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Força da senha</span>
          <span className={cn(
            'text-sm font-medium',
            score >= 70 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-destructive'
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

      {/* Requisitos */}
      {showRequirements && (
        <div className="grid gap-1.5">
          {requirements.map((req, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center gap-2 text-sm transition-colors',
                req.met ? 'text-green-500' : 'text-muted-foreground'
              )}
            >
              {req.met ? (
                <Check className="h-4 w-4 flex-shrink-0" />
              ) : (
                <X className="h-4 w-4 flex-shrink-0 text-muted-foreground/50" />
              )}
              <span>{req.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Aviso se senha é fraca */}
      {score < 50 && password.length > 0 && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
          <p className="text-sm text-destructive">
            Senha fraca. Use uma combinação de letras maiúsculas, minúsculas, números e caracteres especiais.
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
