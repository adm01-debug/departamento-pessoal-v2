/**
 * @fileoverview Sufixo para inputs
 * @module components/input/InputSuffix
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Props do InputSuffix */
interface InputSuffixProps {
  /** Conteúdo do sufixo (texto ou ícone) */
  children: ReactNode;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Sufixo visual para campos de input
 * @param props - Propriedades do componente
 * @returns Elemento JSX
 */
export const InputSuffix = memo(function InputSuffix({
  children,
  className,
}: InputSuffixProps) {
  return (
    <span
      className={cn(
        'flex items-center justify-center px-3 text-muted-foreground bg-muted border border-l-0 rounded-r-md',
        className
      )}
    >
      {children}
    </span>
  );
});
