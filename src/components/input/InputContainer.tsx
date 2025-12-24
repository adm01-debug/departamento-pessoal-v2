/**
 * @fileoverview Container para campos de input
 * @module components/input/InputContainer
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Props do InputContainer */
interface InputContainerProps {
  /** Elementos filhos */
  children: ReactNode;
  /** Classes CSS adicionais */
  className?: string;
  /** Se o campo tem erro */
  hasError?: boolean;
  /** Se o campo está desabilitado */
  disabled?: boolean;
}

/**
 * Container wrapper para campos de formulário
 * @param props - Propriedades do componente
 * @returns Elemento JSX do container
 */
export const InputContainer = memo(function InputContainer({
  children,
  className,
  hasError = false,
  disabled = false,
}: InputContainerProps) {
  return (
    <div
      className={cn(
        'space-y-1.5',
        hasError && 'has-error',
        disabled && 'opacity-60 pointer-events-none',
        className
      )}
    >
      {children}
    </div>
  );
});
