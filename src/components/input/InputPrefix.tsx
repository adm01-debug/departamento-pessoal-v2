/**
 * @fileoverview Prefixo para inputs
 * @module components/input/InputPrefix
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Props do InputPrefix */
interface InputPrefixProps {
  /** Conteúdo do prefixo (texto ou ícone) */
  children: ReactNode;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Prefixo visual para campos de input
 * @param props - Propriedades do componente
 * @returns Elemento JSX
 */
export const InputPrefix = memo(function InputPrefix({
  children,
  className,
}: InputPrefixProps) {
  return (
    <span
      className={cn(
        'flex items-center justify-center px-3 text-muted-foreground bg-muted border border-r-0 rounded-l-md',
        className
      )}
    >
      {children}
    </span>
  );
});
