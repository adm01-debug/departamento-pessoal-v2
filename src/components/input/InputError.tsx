/**
 * @fileoverview Mensagem de erro para inputs
 * @module components/input/InputError
 */
import { memo } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

/** Props do InputError */
interface InputErrorProps {
  /** Mensagem de erro */
  message?: string;
  /** Classes CSS adicionais */
  className?: string;
  /** Se mostra ícone */
  showIcon?: boolean;
}

/**
 * Exibe mensagem de erro para campos de formulário
 * @param props - Propriedades do componente
 * @returns Elemento JSX ou null
 */
export const InputError = memo(function InputError({
  message,
  className,
  showIcon = true,
}: InputErrorProps) {
  if (!message) return null;

  return (
    <p
      className={cn(
        'flex items-center gap-1.5 text-sm text-destructive',
        className
      )}
      role="alert"
    >
      {showIcon && <AlertCircle className="h-3.5 w-3.5" />}
      {message}
    </p>
  );
});
